// Require'd modules
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
const { Translate } = require("@google-cloud/translate");

// require'd local modules
const { proxyRequest } = require("./proxy");

const corsHandler = cors({
    // TODO: get deploy url
    origin: ["localhost:3000"]
});

// variable initialization
const TOO_MANY_SEGMENTS_MESSAGE = "Too many text segments";
const projectId = "Genuis";
// The target language
const firstTarget = "ja";
const secondTarget = "en";

// Instantiates a translate client
const translate = new Translate({
    projectId
});

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

exports.getWarpedSong = functions.https.onRequest(async (req, res) => {
    console.log("Request", req);

    corsHandler(req, res, async () => {
        const { songId } = req.query;
        // attempt to get songId out of firebase
        const songDocRef = db.collection("songs").doc(songId);

        console.log("GET WARPED SONG");

        let responseObj = {};

        songDocRef
            .get()
            .then(async doc => {
                console.log("RESOLVED REQUEST FOR DOC");

                // if song with matching id exists
                if (doc.exists) {
                    console.log("DOC EXISTS");

                    // if warped version exists.
                    const { original, warped, name } = doc.data();
                    if (warped) {
                        console.log("HAS WARPED");
                        // return it
                        res.send({ name, warped });
                        return;
                    } else if (original) {
                        // translate to warped version
                        const warped = await translateSongLyrics(original);
                        // store in firebase
                        songDocRef.set({
                            name,
                            original,
                            warped
                        });
                        // return it
                        res.send({
                            name,
                            warped
                        });
                        return;
                    }
                } else {
                    console.log("DOC DOES NOT EXIST");

                    // else
                    // scrape it to get original
                    const { data } = await proxyRequest(`/songs/${songId}`, {});

                    const song = data.response.song;
                    console.log("GOT DATA");

                    const path = song.path;
                    const originalLyrics = await scrapeContent(path);
                    console.log("ORIGINAL LYRICS");

                    // translate to warped version
                    const warpedLyrics = await translateSongLyrics(
                        originalLyrics
                    );
                    console.log("WARPED LYRICS", warpedLyrics);

                    // store in firebase
                    try {
                        songDocRef.set({
                            name: song.primary_artist.name,
                            original: originalLyrics,
                            warped: warpedLyrics
                        });
                    } catch (err) {
                        console.log(err);
                    }
                    // return it
                    res.send({
                        name: song.primary_artist.name,
                        warped: warpedLyrics
                    });
                    return;
                }
                return;
            })
            .catch(err => {
                res.send(err);
            });
    });
});

const proxy = functions.https.onRequest(async (req, res) => {
    console.log(req);

    corsHandler(req, res, async () => {
        const { params, originalUrl } = req;
        try {
            const response = await proxyRequest(originalUrl, params);
            res.send(response.data);
        } catch (error) {
            console.error("ERROR", error);
            res.send(error.message);
        }
    });
});

exports.proxy = proxy;
