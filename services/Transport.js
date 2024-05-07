const Transport = require("../models/Transport");

exports.getAllTransports = async () => {
  try {
    return await Transport.find({});
  } catch (error) {
    console.error("Error fetching transports:", error);
    throw new Error("Failed to fetch transports");
  }
};

exports.createTransport = async (transportData) => {
  try {
    return await Transport.create(transportData);
  } catch (error) {
    console.error("Error creating transport:", error);
    throw new Error("Failed to create transport");
  }
};
exports.updateTransport = async (transportId, updateData) => {
  try {
    return await Transport.findByIdAndUpdate(transportId, updateData, { new: true });
  } catch (error) {
    console.error("Error updating member:", error);
    throw new Error("Failed to update member");
  }
};
