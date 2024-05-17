// services/ScheduleService.js
const Schedule = require("../models/Schedule");
const Member = require("../models/Member");
const Destination = require("../models/Destination");
const memberService = require("../services/Member.js");
const destinationService = require("../services/Destination");
const ScheduleService = require("../services/Schedule");
const XLSX = require("xlsx");
const axios = require("axios");

const excelSerialNumberToDate = (serialNumber) => {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const EPOCH_OFFSET = 25569;
  const date = new Date((serialNumber - EPOCH_OFFSET) * MS_PER_DAY);
  return date;
};
// const L = require("leaflet");
// const routingMachine = require("leaflet-routing-machine");

// const puppeteer = require("puppeteer");

exports.getAllSchedules = async () => {
  try {
    return await Schedule.find({}).populate([
      { path: "destination" },
      { path: "user", populate: { path: "vehicle" } },
    ]);
  } catch (error) {
    throw error;
  }
};

// exports.calculateDistanceAndDuration = async (startPoint, endPoint) => {
//   try {
//     return (async () => {
//       const browser = await puppeteer.launch();
//       const page = await browser.newPage();
//       await page.goto("https://example.com");

//       await page.evaluate(async () => {
//         const router = routingMachine();

//         router.addWaypoint(startPoint, startPoint);
//         router.addWaypoint(endPoint, endPoint);

//         const route = await router.route();

//         const distance = route.distance;
//         const duration = route.duration;

//         return { distance, duration };
//       });

//       await browser.close();
//     })();
//   } catch (error) {
//     console.error(
//       "Erreur lors du calcul de la distance et de la durée:",
//       error
//     );
//     throw error;
//   }
// };

exports.getDistanceAndDuration = async (startPoint, endPoint) => {
  try {
    const response = await axios.get(
      // `http://router.project-osrm.org/table/v1/driving/${startPoint.longitude},${startPoint.latitude};${endPoint.longitude},${endPoint.latitude}?sources=0`
      `http://router.project-osrm.org/table/v1/driving/${startPoint.longitude},${startPoint.latitude};${endPoint.longitude},${endPoint.latitude}?sources=0`
    );

    // const startLat = startPoint.latitude;
    // const startLon = startPoint.longitude;
    // const endLat = endPoint.latitude;
    // const endLon = endPoint.longitude;

    // const response = await axios.get(
    //   `http://overpass-api.de/api/interpreter?data=[out:json];way(around:1,${startLat},${startLon});way(around:1,${endLat},${endLon});(._;>;);out;`
    // );

    const data = response.data;
    console.log("🚀 ~ exports.getDistanceAndDuration= ~ data:", data);
    const destinations = data.destinations;
    const durations = data.durations;

    let totalDistance = 0;
    let totalTime = 0;

    if (durations.length > 0) {
      totalTime = durations[0][1];
    }

    for (const destination of destinations) {
      totalDistance += destination.distance;
    }

    return { distance: totalDistance, duration: totalTime };
  } catch (error) {
    console.error(
      "Erreur lors de la récupération de la distance et de la durée:",
      error
    );
    throw error;
  }
};

exports.uploadScheduleData = async (file) => {
  try {
    const bufferArray = file.buffer;
    const wb = XLSX.read(bufferArray, { type: "buffer" });
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];
    const data = XLSX.utils.sheet_to_json(ws);
    console.log("data", data);
    const newData = await Promise.all(
      data.map(async (item, index) => {
        console.log('item["Date Activité"]', item["Date Activité"]);

        console.log(
          "formattedDate",
          excelSerialNumberToDate(item["Date Activité"])
        );
        var idUser = await Member.findOne({
          fullName: {
            $regex: new RegExp(item["Delegué"].toLowerCase(), "i"),
          },
        });
        var idDestination = await Destination.findOne({
          name: {
            $regex: new RegExp(item["Prospect"].toLowerCase(), "i"),
          },
        });
        if (idUser && idDestination && idUser.vehicle) {
          return {
            user: idUser._id,
            date: excelSerialNumberToDate(item["Date Activité"]),
            slot: item["Séance"],
            zone: item["Commune"],
            codepostal: item["Code Postal"],
            adresse: item.Adresse,
            type: item["Type Prospect"],
            destination: idDestination._id,
            latitude: idDestination.latitude,
            longitude: idDestination.longitude,
            sequence: item.sequence || index,
          };
        } else {
          console.log("User or destination not found for item:", item);
          return { invalidItem: item };
        }
        /*if(!idUser){

      idUser = await memberService.createMember({fullName:item.User})

     }*/
        /*if(!idDestination){

      idDestination = await destinationService.createDestination({name:item.Destination,address:item.Adresse,postalCode:item["Code Postal"],zone:item.Zone})

     }*/

        /*return { user: idUser._id, date: new Date(item.Date), slot: item.Slot, zone: item.Zone, codepostal: item["Code Postal"], adresse: item.Adresse, type: item.Type, destination: idDestination._id }*/
      })
    );
    //console.log("idUser",idUser,idDestination)
    const hasInvalidData = newData.some(
      (item) => item.invalidItem !== undefined
    );
    if (hasInvalidData) {
      throw new Error(
        "Some data could not be uploaded due to missing user or destination information."
      );
    }

    console.log("newdata", newData);
    // let sumDistances = 0;
    // let sumDurations = 0;

    // for (let i = 0; i < newData.length - 1; i++) {
    //   const startPoint = newData[i];
    //   const endPoint = newData[i + 1];

    //   // await axios
    //   //   .get(
    //   //     `http://router.project-osrm.org/table/v1/driving/${startPoint.longitude},${startPoint.latitude};${endPoint.longitude},${startPoint.latitude}?sources=0`
    //   //   )
    //   //   .then((response) => {
    //   //     // console.log("resonse", response);
    //   //     // console.log("data", response.data);
    //   //     console.log(
    //   //       "🚀 ~ exports.uploadScheduleData= ~ points:",
    //   //       startPoint,
    //   //       endPoint
    //   //     );
    //   //     console.log("destinations", response.data.destinations);
    //   //     console.log("durations", response.data.durations);
    //   //   })
    //   //   .catch((e) => {
    //   //     console.log("eeeee", e);
    //   //   });

    //   const result = await this.getDistanceAndDuration(startPoint, endPoint);

    //   // const result = await this.calculateDistanceAndDuration(
    //   //   startPoint,
    //   //   endPoint
    //   // );
    //   // console.log(
    //   //   "🚀 ~ exports.uploadScheduleData= ~ result:",
    //   //   startPoint,
    //   //   endPoint,
    //   //   result
    //   // );

    //   const totalDuration = Math.round((result.duration % 3600) / 60);
    //   const totalDistance = result.distance / 1000;
    //   sumDistances += totalDistance;
    //   sumDurations += totalDuration;
    // }

    // console.log(
    //   "🚀 ~ exports.uploadScheduleData= ~ sumDistances:",
    //   sumDistances
    // );

    // console.log(
    //   "🚀 ~ exports.uploadScheduleData= ~ sumDurations:",
    //   sumDurations
    // );

    // await Schedule.insertMany(newData);

    // const scheduleData = await Promise.all(
    //   newData.map(async (item) => {
    //     if (!item.invalidItem) {
    //       await ScheduleService.getScheduleForUserAndDate(item.user, item.date);
    //     }
    //   })
    // );
    // console.log("scheduleData", scheduleData);
    return newData;
  } catch (error) {
    console.log("error", error);
    throw new Error(`Error uploading schedule data: ${error.message}`);
  }
};

exports.addScheduleData = async (data) => {
  try {
    // await Schedule.insertMany(data.scheduleData);
    //add model carbonEmission
    //add in carbon emission data.totalDuration and data.totalDistance + calcul carbonEmission with formula

    return 200;
  } catch (error) {
    throw error;
  }
};

exports.getAllSchedulesByUser = async (user) => {
  try {
    return await Schedule.find({ user: user }).populate([
      { path: "destination" },
      { path: "user", populate: { path: "vehicle" } },
    ]);
  } catch (error) {
    throw error;
  }
};
exports.getScheduleForUserAndDate = async (user, date) => {
  try {
    const allSchedule = await Schedule.find({ user: user, date: date })
      .populate([
        { path: "destination" },
        { path: "user", populate: { path: "vehicle" } },
      ])
      .sort({ sequence: 1 });
    console.log("allSchedule", allSchedule);
    return allSchedule;
  } catch (e) {
    console.log("ERROR: ", e);
    throw e.message;
  }
};
