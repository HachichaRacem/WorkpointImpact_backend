const profile = require("../models/profile");

exports.getAllProfile = async(req,res)=>{
try {
    return await profile.find({});
} catch (error) {
    console.error("Error fetching members:", error);
    throw new Error("Failed to fetch members"); 
}
}
exports.createProfile = async (profileData) => {
    try {
      return await profile.create(profileData);
    } catch (error) {
      console.error("Error creating member:", error);
      throw new Error("Failed to create member");
    }
  };