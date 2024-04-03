import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import bodyParser from 'body-parser';
import multer from 'multer';
const app = express();
const port = 3000;
const conn_str = 'mongodb+srv://racemhachicha1:racem@cluster0.6vfqy2f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const client = new MongoClient(conn_str)
const database = client.db('impactProject')
const members = database.collection('members')
const transports = database.collection('transports')
const destinations = database.collection('destinations')
const uploadCollection = database.collection('upload')

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// Multer middleware for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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

// Destinations Routes
app.post("/destinations", async (req, res) => {
  try {
    const data = req.body;
    if (Object.keys(data).length != 9) {
      res.statusCode = 400;
      res.json("Invalid data was sent");
    } else {
      await destinations.insertOne(data);
      res.json(`${data['fullName']} has been added to the database.`);
    }
  } catch (e) {
    console.log("ERROR", e);
  }
});

app.get("/destinations", async (req, res) => {
  try {
    const allDestinations = await destinations.find({}).toArray();
    res.json(allDestinations);
  } catch (e) {
    console.log("ERROR: ", e);
  }
});

// Transports Routes
app.post("/transports", async (req, res) => {
  try {
    const data = req.body;
    if (Object.keys(data).length != 6) {
      res.statusCode = 400;
      res.json("Invalid data was sent");
    } else {
      await transports.insertOne(data);
      res.json(`${data['fullName']} has been added to the database.`);
    }
  } catch (e) {
    console.log("ERROR", e);
  }
});

app.get("/transports", async (req, res) => {
  try {
    const allTransports = await transports.find({}).toArray();
    res.json(allTransports);
  } catch (e) {
    console.log("ERROR: ", e);
  }
});

// File Upload Route
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const result = await uploadCollection.insertOne({
      filename: file.originalname,
      contentType: file.mimetype,
      data: file.buffer,
    });

    res.status(201).json({ message: 'File uploaded successfully', fileId: result.insertedId });
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
