const faunadb = require("faunadb");
const q = faunadb.query;

const { FAUNADB_SERVER_SECRET } = process.env;

const client = new faunadb.Client({
    secret: FAUNADB_SERVER_SECRET
});

async function getAllSongs() {
    const { data } = await client.query(
        q.Paginate(q.Match(q.Index("all_song")))
    );

    data.forEach(async element => {
        const song = await client.query(q.Delete(element));
        console.log(song);
    });
}

getAllSongs();
