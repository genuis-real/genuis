const fetch = require("node-fetch");
const cheerio = require("cheerio");
const faunadb = require("faunadb");
const { Translate } = require("@google-cloud/translate");

const { FAUNADB_SERVER_SECRET } = process.env;

const client = new faunadb.Client({
    secret: FAUNADB_SERVER_SECRET
});

// variable initialization
const TOO_MANY_SEGMENTS_MESSAGE = "Too many text segments";
const projectId = "Genuis";
// The target language
const firstTarget = "ja";
const secondTarget = "en";

const { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY } = process.env;
const privateKey = GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n");

// Instantiates a translate client
const translate = new Translate({
    credentials: {
        client_email: GOOGLE_CLIENT_EMAIL,
        private_key: privateKey
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
    let lyricsDataCopy = lyricsData;
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
    console.log("GET WARPED SONG");

    try {
        // Try to get from fauna

        // If exists
        // if warped exists
        // return warped
        // else
        // warp it
        // return warped

        // get song lyrics
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

        const data = await response.json();
        const song = data.response.song;

        const originalLyrics = await scrapeContent(song.path);
        const warped = await translateSongLyrics(originalLyrics);

        return {
            statusCode: 200,
            body: JSON.stringify({
                name: song.primary_artist.name,
                warped
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
