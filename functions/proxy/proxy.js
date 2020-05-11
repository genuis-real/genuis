/* eslint-disable */
const fetch = require("node-fetch");
const { URL, URLSearchParams } = require("url");

exports.handler = async function (event, context) {
    const { GENIUS_AUTH_TOKEN } = process.env;

    const urlString = event.path.replace("/.netlify/functions/proxy/", "");
    // const url = new URL(`https://api.genius.com/${urlString}`);
    const url = new URL(`https://genius.com/api/${urlString}`);
    url.search = new URLSearchParams(event.queryStringParameters);

    try {
        const response = await fetch(url, {
            headers: {
                Accept: "application/json",
                // Authorization: `Bearer ${GENIUS_AUTH_TOKEN}`,
            },
        });

        if (!response.ok) {
            // NOT res.status >= 200 && res.status < 300
            return { statusCode: response.status, body: response.statusText };
        }
        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (err) {
        console.log(err); // output to netlify function log
        return {
            statusCode: 500,
            body: JSON.stringify({ msg: err.message }), // Could be a custom message or object i.e. JSON.stringify(err)
        };
    }
};
