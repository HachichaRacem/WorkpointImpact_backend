const carbonemission= require("../models/CarbonEmission.js");
exports.getAllCarbonEmission = async(req,res)=>{
    try {
        return await carbonemission.find({}).populate([{path : 'user'},{path:'formule'}]);
    } catch (error) {
        console.error("Error fetching :", error);
        throw new Error("Failed to fetch");
    }
    
    }
    exports.createformule = async (formuleData) => {
        try {
          return await carbonemission.create(formuleData);
        } catch (error) {
          console.error("Error creating :", error);
          throw new Error("Failed to create ");
        }
      };