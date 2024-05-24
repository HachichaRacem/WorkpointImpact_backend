const carbonemission= require("../models/CarbonEmission.js");
exports.getAllCarbonEmission = async(req,res)=>{
    try {
        return await carbonemission.find({}).populate([{path : 'user'},{path:'formule'}]);
    } catch (error) {
        console.error("Error fetching :", error);
        throw new Error("Failed to fetch");
    }
    
    }
     exports.getCarbonEmissionsByDate = async (date) => {
      try {
        // Ensure the date is in ISO format for consistency
        const emissions = await carbonemission.find({
         date : date}).populate('user').populate('formule');
        
        return emissions;
      } catch (error) {
        throw new Error(`Error fetching carbon emissions: ${error.message}`);
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