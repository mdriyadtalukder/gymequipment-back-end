const express = require('express');
var cors = require('cors');
const app = express();
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
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
        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.findOne(query);
            res.send(result);
        });
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser=req.body;
            const filter = { _id: ObjectId(id) };
            const options={upsert:true};
            const updateDoc={
                $set:{
                    quantity:updateUser.quantity
                }
            }

            const result = await movies.updateOne(filter, updateDoc, options);
            res.send(result);
        })

    } finally {

    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello gym equipment house!')
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})