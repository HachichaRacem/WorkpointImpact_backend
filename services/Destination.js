const Destination = require("../models/Destination");

exports.getAllDestinations = async () => {
  try {
    return await Destination.find({});
  } catch (error) {
    console.error("Error fetching destinations:", error);
    throw new Error("Failed to fetch destinations");
  }
};

exports.createDestination = async (destinationData) => {
  try {
    return await Destination.create(destinationData);
  } catch (error) {
    console.error("Error creating destination:", error);
    throw new Error("Failed to create destination");
  }
};
