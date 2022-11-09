const express = require('express');
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const port = process.env.PORT || 5000;
require('dotenv').config();
  

// setting up middlewares
app.use(cors());
app.use(express.json());
//common index api

app.get('/',(req,res)=>{
    res.send('Food server is Currently Active')
})

//connecting mongoDB
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wxeycza.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
const ServiceCollection = client.db('cookingLuxury').collection('services');
const reviewCollection = client.db('cookingLuxury').collection('Reviews');
const OffersCollection = client.db('cookingLuxury').collection('Offers');
  //creating a async function
async function run(){
try{
//API to get all services
app.get('/allservices',async(req,res)=>{
  const query={};
  const cursor = ServiceCollection.find(query);
  const services = await cursor.toArray();
  res.send(services)
});
//get api for limited number services
app.get('/services',async(req,res)=>{
  const query={};
  const cursor = ServiceCollection.find(query).limit(3);
  const services = await cursor.toArray();
  res.send(services)
});
app.get('/details/:id',async(req,res)=>{
  const id = req.params.id;
  const query = {_id:ObjectId(id)};
  const cursor = ServiceCollection.find(query);
  const service = await cursor.toArray();
  res.send(service)
});

//API to POST Review Data on Database

app.post('/reviews',async(req,res)=>{
  const reviews= req.body;
  const result = await reviewCollection.insertOne(reviews);
  res.send(result)

});

//api to insert new service to database
app.post('/services',async(req,res)=>{
  const query= req.body;
  const result = await ServiceCollection.insertOne(query);
  res.send(result)
});
//API to get Offers
app.get('/offers',async(req,res)=>{
  const query ={};
  const cursor = OffersCollection.find(query);
  const result =await cursor.toArray();
  res.send(result);
  console.log(result)
})

//API to get All Review
app.get('/review/:id',async(req,res)=>{
  const id = req.params.id;
  const query ={id};
  const cursor = reviewCollection.find(query);
  const review = await cursor.toArray();
  res.send(review)
});

//API to get review according to specific user
app.get('/myReviews',async(req,res)=>{
  const email = req.query.email;
  const query = {email:email};
  const cursor = reviewCollection.find(query);
  const result = await cursor.toArray();
  console.log(result);
  res.send(result)
});
//API to Update Review
app.patch('/reviews/:id',async(req,res)=>{
  const id = req.params.id;
  console.log(id)
  const changes = req.body;
  const query= {_id:ObjectId(id)};
  const updatedDoc = {
    $set:{
      name:changes.name,
    photo:changes.photo,
    review:changes.review,
    }
  };
  const result = await reviewCollection.updateOne(query,updatedDoc);
  console.log(result)
  res.send(result);

})
//API to delete a review
app.delete('/delete/:id',async(req,res)=>{
  const id = req.params.id;
  const query = {_id:ObjectId(id)};
  const result = await reviewCollection.deleteOne(query);
  console.log(result)
  res.send(result)
})
}
finally{
    
}
}
run().catch(e=> console.error(e))



app.listen(port,()=> console.log('food server is running on port:',port))