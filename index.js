import express from "express";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";
import bodyParser from "body-parser";
import multer from "multer";
import logger from "morgan";

const app = express();
const port = 3000;
const conn_str =
  "mongodb+srv://racemhachicha1:racem@cluster0.6vfqy2f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(conn_str);
const database = client.db("impactProject");
const members = database.collection("members");
const transports = database.collection("transports");
const destinations = database.collection("destinations");
const uploadCollection = database.collection("upload");
const schedule = database.collection("schedule");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger("dev"));

// Multer middleware for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/destinations", async (_, res) => {
  try {
    const allDestinations = await destinations.find({}).toArray();
    res.json(allDestinations);
  } catch (e) {
    console.log("ERROR : " + e);
  }
});

app.get("/transports", async (_, res) => {
  try {
    const allTransports = await transports.find({}).toArray();
    res.json(allTransports);
  } catch (e) {
    console.log("ERROR : " + e);
  }
});

app.get("/schedule", async (_, res) => {
  try {
    const allSchedule = await schedule.find({}).toArray();
    res.json(allSchedule);
  } catch (e) {
    console.log("ERROR : " + e);
  }
});

app.patch("/members", async (req, res) => {
  try {
    const data = req.body;
    if (Object.keys(data).length != 8) {
      res.statusCode = 400;
      res.json("Invalid data was sent");
    } else {
      const id = new ObjectId(`${data["_id"]}`);
      const filter = { _id: id };
      delete data["_id"];
      const result = await members.updateOne(filter, { $set: data });
      if (result.acknowledged && result.matchedCount != 0) {
        if (result.modifiedCount != 0) {
          res.json(`${data["fullName"]} has been updated.`);
          return;
        }
      }
      res.json(`${result}`);
    }
  } catch (e) {
    console.log("ERROR", e);
  }
});

app.post("/members", async (req, res) => {
  try {
    const data = req.body;
    if (Object.keys(data).length != 7) {
      res.statusCode = 400;
      res.json("Invalid data was sent");
    } else {
      await members.insertOne(data);
      res.json(`${data["fullName"]} has been added to the database.`);
    }
  } catch (e) {
    console.log("ERROR", e);
  }
});
app.get("/members", async (req, res) => {
  try {
    const allMembers = await members.find({}).toArray();
    let data = [];
    for (const member of allMembers) {
      const car = await transports.findOne({ _id: member.vehicle });
      data.push({ ...member, vehicle: car });
    }
    res.json(data);
  } catch (e) {
    console.log("ERROR : " + e);
  }
});

// Destinations Routes
app.post("/destinations", async (req, res) => {
  try {
    const data = req.body;
    if (Object.keys(data).length != 9) {
      res.statusCode = 400;
      res.json("Invalid data was sent");
    } else {
      await destinations.insertOne(data);
      res.json(`${data["fullName"]} has been added to the database.`);
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
      res.json(`${data["fullName"]} has been added to the database.`);
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
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const bufferArray = req.file.buffer;
    const wb = XLSX.read(bufferArray, { type: "buffer" });
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];
    const data = XLSX.utils.sheet_to_json(ws);

    // Insert Excel data into the database
    await excelDataCollection.insertMany(data);

    res.json({ message: "Data uploaded successfully." });
  } catch (error) {
    console.error("Error uploading Excel data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
app.get("/upload", async (req, res) => {
  try {
    const destinations = await excelDataCollection.find().toArray();
    res.json(destinations);
  } catch (error) {
    res.status(500).json({ message: "Error fetching data" });
  }
});

//Schedule
app.get("/schedule", async (req, res) => {
  try {
    const allSchedule = await schedule.find({}).toArray();
    res.json(allSchedule);
  } catch (e) {
    console.log("ERROR: ", e);
  }
});

app.get("/schedule/:user/:date", async (req, res) => {
  try {
    const user = req.params.user;
    const date = new Date(req.params.date);
    const allSchedule = await schedule
      .find({ User: user, Date: date })
      .toArray();
    console.log("allSchedule", allSchedule);
    const sortedResult = allSchedule.sort((a, b) => {
      return a.sequence - b.sequence;
    });
    var result = [];
    for (const item of sortedResult) {
      const dest = await destinations.findOne({ _id: item.Destination });
      result.push({ ...item, Destination: dest });
    }

    const driver = await members.findOne({ fullName: user });
    const car = await transports.findOne({ _id: driver.vehicle });

    // const destinationsName = Array.from(
    //   sortedResult,
    //   ({ Destination }) => Destination
    // );
    // const result = await destinations
    //   .find({ name: { $in: destinationsName } })
    //   .toArray();
    // const sortedResult = result.sort((a, b) => {
    //   return b.updatedAt - a.updatedAt;
    // });

    const data = {
      schedule: result,
      car: car,
    };

    console.log("destination", data);
    res.json(data);
  } catch (e) {
    console.log("ERROR: ", e);
  }
});

app.get("/schedule/:user", async (req, res) => {
  try {
    const user = req.params.user;
    const date = new Date(req.params.date);
    const allSchedule = await schedule.find({ User: user }).toArray();

    // const allSchedule = await scheduleModel.find({ User: user }).toArray();
    console.log("allSchedule", allSchedule);
    const sortedResult = allSchedule.sort((a, b) => {
      return b.sequence - a.sequence;
    });
    console.log("🚀 ~ sortedResult ~ sortedResult:", sortedResult);
    const driver = await members.findOne({ fullName: user });
    const car = await transports.findOne({ _id: driver.vehicle });
    var result = [];
    for (const item of sortedResult) {
      const dest = await destinations.findOne({ _id: item.Destination });
      result.push({
        ...item,
        destination: dest,
        car: car,
      });
    }

    console.log("result", result);
    res.json(result);
  } catch (e) {
    console.log("ERROR: ", e);
  }
});

// Endpoint to fetch destination based on User
app.get("/Destination?User", async (req, res) => {
  const { User } = req.params;
  try {
    const schedule = await Schedule.findOne({ User }); // Assuming there's a field named "User" in your Schedule model
    if (!schedule) {
      return res.status(404).json({ message: "Schedule not found" });
    }
    res.json({ Destination: schedule.Destination });
  } catch (error) {
    console.error("Error fetching Destination:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
