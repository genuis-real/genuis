const fetch = require("node-fetch");
const cheerio = require("cheerio");
const faunadb = require("faunadb");
const { Translate } = require("@google-cloud/translate");
const {
    FAUNADB_SERVER_SECRET,
    GOOGLE_CLIENT_EMAIL,
    GOOGLE_PRIVATE_KEY
} = process.env;

const client = new faunadb.Client({
    secret: FAUNADB_SERVER_SECRET
});
const q = faunadb.query;

// variable initialization
const TOO_MANY_SEGMENTS_MESSAGE = "Too many text segments";
const projectId = "Genuis";
// The target language
const firstTarget = "ja";
const secondTarget = "en";

// Instantiates a translate client
const translate = new Translate({
    credentials: {
        client_email: GOOGLE_CLIENT_EMAIL,
        private_key: GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n")
    },
    projectId
});

async function scrapeContent(path) {
    const pageHtml = await fetch(`https://genius.com${path}`)
        .then(response => response.text())
        .then(body => body);

    const $ = cheerio.load(pageHtml);
    const lyrics = $(".lyrics p");
    const children = lyrics.contents();

    const lyricsData = [];

    children.map((_, element) => {
        const el = $(element);
        if (el[0].name === "br") return null;

        const data = el[0].data;
        if (data && data.startsWith("\n")) {
            const newData = data.replace("\n", "").trim();
            if (newData === "") return null;
        }

        const lyric = {
            text: el.text().trim(),
            referentId: el.data("id") || null
        };

        lyricsData.push(lyric);
    });

    return lyricsData;
}

async function translateSongLyrics(lyricsData) {
    // Spread into a new object to avoid mutating original data.
    let lyricsDataCopy = JSON.parse(JSON.stringify(lyricsData));

    let retry = false;

    do {
        let lyricsText = lyricsDataCopy.map(({ text }) => text);

        try {
            // eslint-disable-next-line
            let translationResults = await translate.translate(
                lyricsText,
                firstTarget
            );
            // Result of a translate call is always an array, the first item of which is the translated text/texts
            let translatedLyrics = translationResults[0];

            // eslint-disable-next-line
            translationResults = await translate.translate(
                translatedLyrics,
                secondTarget
            );
            translatedLyrics = translationResults[0];

            // eslint-disable-next-line
            translatedLyrics.forEach((result, index) => {
                lyricsDataCopy[index].text = result;
            });
            retry = false;
        } catch (err) {
            if (err.message === TOO_MANY_SEGMENTS_MESSAGE) {
                lyricsDataCopy = lyricsDataCopy.slice(0, 99);
                lyricsDataCopy.push({ text: "(song is too long)" });
                retry = true;
            } else {
                throw err;
            }
        }
    } while (retry);

    return lyricsDataCopy;
}

exports.handler = async function(event, context) {
    const { songId } = event.queryStringParameters;
    const { GENIUS_AUTH_TOKEN } = process.env;

    try {
        // Try to get from fauna
        const { data } = await client.query(
            q.Paginate(q.Match(q.Index("song_by_id"), songId))
        );

        if (data.length > 0) {
            const dbSong = await client.query(q.Get(data[0]));
            console.log(`fetched song with id ${songId} from DB`);
            return {
                statusCode: 200,
                body: JSON.stringify({
                    artistName: dbSong.data.artistName,
                    warped: dbSong.data.lyrics.warped
                })
            };
        }

        const response = await fetch(`https://api.genius.com/songs/${songId}`, {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${GENIUS_AUTH_TOKEN}`
            }
        });

        if (!response.ok) {
            return {
                statusCode: response.status,
                body: response.statusText
            };
        }

        const json = await response.json();
        const song = json.response.song;

        const originalLyrics = await scrapeContent(song.path);
        console.log(originalLyrics[0]);

        const warpedLyrics = await translateSongLyrics(originalLyrics);
        console.log(originalLyrics[0]);

        const songObj = {
            id: songId,
            artistName: song.primary_artist.name,
            lyrics: {
                original: originalLyrics,
                warped: warpedLyrics
            }
        };

        console.log(`scraped song with id ${songId}`);
        await client.query(q.Create(q.Class("song"), { data: songObj }));
        console.log(`added song with id ${songId} to the db`);
        return {
            statusCode: 200,
            body: JSON.stringify({
                artistName: songObj.artistName,
                warped: warpedLyrics
            })
        };
    } catch (err) {
        console.log(err); // output to netlify function log
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: err.message }) // Could be a custom message or object i.e. JSON.stringify(err)
        };
    }
};
