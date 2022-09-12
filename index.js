const express = require('express')
const app = express()
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zbtoj.mongodb.net/?retryWrites=true&w=majority`;
console.log('Database connected', uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
  try {
    await client.connect();
    const orderCollection = client.db('one-step-solution').collection('order')
    app.get('/order', async(res, req)=>{
      const query = {}
      const cursor = orderCollection.find(query)
      const orders = await cursor.toArray();
      res.send(orders)
    })
    app.get('/order/:id',async(req, res)=>{
      const id = req.params.id
      const query = {_id: ObjectId(id)}
      const result = await orderCollection.findOne(query)
      res.send(result)
    })
    
  } 
  finally{
    
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})