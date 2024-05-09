const profile = require("../services/Profile");

exports.getAllProfile = async(req,res)=>{
try {

const allProfile = await profile.getAllProfile(req,res);
return res.json(allProfile);
} catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ message: "Internal Server Error" });
    
}
};
exports.createProfile = async (req, res) => {
    try {
      const newProfile = await profile.createProfile(req.body);
      res.json(newProfile);
    } catch (error) {
      console.error("Controller error:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };