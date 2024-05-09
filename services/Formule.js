const formule = require("../models/formule");

exports.getAllFormule = async(req,res)=>{
try {
    return await formule.find({});
} catch (error) {
    console.error("Error fetching members:", error);
    throw new Error("Failed to fetch members");
}

}