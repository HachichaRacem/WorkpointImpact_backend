const transportService = require("../services/Transport");

exports.getAllTransports = async (req, res) => {
  try {
    const allTransports = await transportService.getAllTransports();
    res.json(allTransports);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createTransport = async (req, res) => {
  try {
    const newTransport = await transportService.createTransport(req.body);
    res.json(newTransport);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
