const formule = require("../services/Formule");


exports.getAllFormule = async(req,res)=>{
try {
    const allFormule =await formule.getAllFormule(req,res);
    return res.json(allFormule);
} catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ message: "Internal Server Error" });
}
}
exports.createformule = async (req, res) => {
    try {
      const newFormule = await formule.createformule(req.body);
      res.json(newFormule);
    } catch (error) {
      console.error("Controller error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };