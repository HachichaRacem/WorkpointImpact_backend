import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import bodyParser from 'body-parser';
const app = express();
const port = 3000;
const conn_str = 'mongodb+srv://racemhachicha1:racem@cluster0.6vfqy2f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const client = new MongoClient(conn_str)
const database = client.db('impactProject');
const members = database.collection('members');
const transports = database.collection('transports')
const destinations = database.collection('destinations')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

app.get("/destinations", async(_, res) => {
  try{
    const allDestinations = await destinations.find({}).toArray();
    res.json(allDestinations)
  }catch(e){
    console.log("ERROR : " + e)
  }
})

app.get("/transports", async(_, res) => {
  try{
    const allTransports = await transports.find({}).toArray();
    res.json(allTransports)
  }catch(e){
    console.log("ERROR : " + e)
  }
})

app.patch("/members", async(req, res) => {
  try{
    const data = req.body
    if(Object.keys(data).length != 8){
      res.statusCode = 400
      res.json("Invalid data was sent")
    }else{
      const id = new ObjectId(`${data['_id']}`)
      const filter = {_id: id}
      delete data['_id']
      const result = await members.updateOne(filter, {$set:data})
      if(result.acknowledged && result.matchedCount != 0){
        if(result.modifiedCount != 0){
          res.json(`${data['fullName']} has been updated.`)
          return;
        }
      }
      res.json(`${result}`)
    }
  }catch(e){
    console.log("ERROR", e)
  }
})

app.post("/members", async(req, res) => {
  try{
    const data = req.body
    if(Object.keys(data).length != 7){
      res.statusCode = 400
      res.json("Invalid data was sent")
    }else{
      await members.insertOne(data)
      res.json(`${data['fullName']} has been added to the database.`)
    }
  }catch(e){
    console.log("ERROR", e)
  }
})
app.get("/members", async(req, res) => {
  try{
    const allMembers = await members.find({}).toArray();
    res.json(allMembers)
  }catch(e){
    console.log("ERROR : " + e)
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
