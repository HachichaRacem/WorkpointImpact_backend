const formule = require("../models/formule");

exports.getAllFormule = async(req,res)=>{
try {
    return await formule.find({});
} catch (error) {
    console.error("Error fetching :", error);
    throw new Error("Failed to fetch");
}

}
exports.createformule = async (formuleData) => {
    try {
      return await formule.create(formuleData);
    } catch (error) {
      console.error("Error creating :", error);
      throw new Error("Failed to create ");
    }
  };