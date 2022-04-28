const express = require('express');
var cors = require('cors');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 5000;



app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.u8fjq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const userCollection = client.db("gymequipment").collection("products");
        app.get('/users', async (req, res) => {

            const query = {};
            const cursor = userCollection.find(query);
            const users = await cursor.toArray();
            res.send(users)
        })

    } finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})