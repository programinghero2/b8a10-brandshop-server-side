const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config()
const app = express()

// middleware
app.use(cors())
app.use(express.json())
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wxrtt5h.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(Optional Starting in v4.7)
        // await client.connect();
        const productCollection = client.db("productDB").collection("products")
        const cartProductCollection = client.db("productDB").collection("cartProducts")
        app.post("/product", async (req, res) => {
            const productInfo = req.body;
            const result = await productCollection.insertOne(productInfo)
            res.send(result)

        })
        app.post("/cartProduct", async (req, res) => {
            const cartProductInfo = req.body;
            const result = await cartProductCollection.insertOne(cartProductInfo)
            res.send(result)
        })
        app.get("/cartProduct", async (req, res) => {
            const result = await cartProductCollection.find().toArray()
            res.send(result)
        })
        app.get("/product", async (req, res) => {
            const result = await productCollection.find().toArray()
            res.send(result)
        })
        app.get("/product/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await productCollection.findOne(query)
            res.send(result)
        })
        app.delete("/cartProduct/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await cartProductCollection.deleteOne(query)
            res.send(result)
        })
        app.put("/product/:id", async(req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true };
            const product = req.body;
            const updateProduct = {
                $set: {
                     productType : product.productType,
                     productName : product.productName,
                     brandName : product.brandName,
                     photo : product.photo,
                     price : product.price,
                     description : product.description,
                     rating : product.rating
                }
            }
            const result = await productCollection.updateOne(filter,updateProduct,options)
            res.send(result)
        })
        // Send a Ping to Confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // await client.close();
    }
}
run().catch(console.dir);


app.get("/", (req, res) => {
    res.send("assignment 10 server is running")
})
app.listen(port, () => {
    console.log(`assignment 10 server is running on port ${port}`)
})