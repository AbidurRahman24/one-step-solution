const express = require('express')
const cors = require('cors');
const app = express()
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zbtoj.mongodb.net/?retryWrites=true&w=majority`;
// console.log('Database connected', uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
  try {
    await client.connect();
    const orderCollection = client.db('one-step-solution').collection('order')
    const productCollection = client.db('one-step-solution').collection('product')
    app.get('/order', async (req, res) => {
      const query = {};
      const cursor = orderCollection.find(query);
      const order = await cursor.toArray();
      res.send(order);
    })
    app.get('/order/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await orderCollection.findOne(query)
      res.send(result)
    })
    // POST
    app.post('/order', async (req, res) => {
      const newService = req.body;
      const result = await orderCollection.insertOne(newService);
      res.send(result);
    });
    app.delete('/order/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });
    // received product via post method
    app.post('/addProduct', async (req, res) => {
      const received = req.body;
      const result = await productCollection.insertOne(received);
      res.send(result);
    });
  }
  finally {

  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})