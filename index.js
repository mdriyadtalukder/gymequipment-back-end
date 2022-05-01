const express = require('express');
var cors = require('cors');
const jwt = require('jsonwebtoken');
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


        app.post('/login', async (req, res) => {
            const user = req.body;
            const accessToken = jwt.sign(user, process.env.app.ACCESS_TOKEN_SECRET, {
                expiresId: 'Id'
            });

            res.send({ accessToken });
        });



        app.get('/users', async (req, res) => {
            if (req.query.email) {
                const email = req.query.email;
                const query = { email: email };
                const cursor = userCollection.find(query);
                const users = await cursor.toArray();
                res.send(users)
            }
            else {
                const query = {};
                const cursor = userCollection.find(query);
                const users = await cursor.toArray();
                res.send(users)
            }

        });

        app.post('/users', async (req, res) => {
            const newUser = req.body;
            console.log(newUser);
            const result = await userCollection.insertOne(newUser);
            res.send(result);

        });

        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.deleteOne(query);
            res.send(result);
        });

        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await userCollection.findOne(query);
            res.send(result);
        });
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const updateUser = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    quantity: updateUser.quantity
                }
            };

            const result = await userCollection.updateOne(filter, updateDoc, options);
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