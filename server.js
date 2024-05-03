const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const logger = require("morgan");

const memberRoutes = require("./routes/Member");
const destinationRoutes = require("./routes/Destination");
const transportRoutes = require("./routes/Transport");
const scheduleRoutes = require('./routes/Schedule');
//const scheduleRoutes = require("./routes/Schedule");

const app = express();
const port = process.env.PORT || 3000;


//db
mongoose.connect( "mongodb+srv://racemhachicha1:racem@cluster0.6vfqy2f.mongodb.net/impactProject")
  .then(() => console.log(`DB CONNECTED`))
  .catch((err) => console.log(`DB CONNECTION ERROR`, err));

  app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger("dev"));


app.use("/members", memberRoutes);
app.use("/destinations", destinationRoutes);
app.use("/transports", transportRoutes);
app.use("/schedule", scheduleRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

