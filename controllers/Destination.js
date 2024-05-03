const destinationService = require("../services/Destination");

exports.getAllDestinations = async (req, res) => {
  try {
    const allDestinations = await destinationService.getAllDestinations();
    res.json(allDestinations);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createDestination = async (req, res) => {
  try {
    const newDestination = await destinationService.createDestination(req.body);
    res.json(newDestination);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(400).json({ message: error.message });
  }
};
