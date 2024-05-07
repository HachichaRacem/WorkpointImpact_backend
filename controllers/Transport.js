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
exports.updateTransport = async (req, res) => {
  const  transportId  = req.params.id;
  const updateData = req.body;
  try {
    const updatedTransport = await transportService.updateTransport(transportId, updateData);
    res.status(200).json(updatedTransport);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
