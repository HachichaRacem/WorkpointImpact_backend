const carbonemission = require("../services/CarbonEmission.js");
exports.getAllCarboneEmission = async(req,res)=>{
    try {
        const allCarbon = await carbonemission.getAllCarbonEmission(req,res);
        return res.json(allCarbon);
    } catch (error) {
        console.error("Controller error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
    }
    exports.createformule = async (req, res) => {
        try {
          const newFormule = await carbonemission.createformule(req.body);
          res.json(newFormule);
        } catch (error) {
          console.error("Controller error:", error);
          res.status(500).json({ message: "Internal Server Error" });
        }
      };