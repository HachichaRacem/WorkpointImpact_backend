const formule = require("../services/Formule");


exports.getAllFormule = async(req,res)=>{
try {
    const allFormule = formule.getAllFormule(req,res);
    return res.json(allFormule);
} catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ message: "Internal Server Error" });
}
}