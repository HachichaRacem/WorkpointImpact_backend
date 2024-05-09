
const Member = require("../models/Member");

exports.getAllMembers = async (req, res) => {
  try {
    return await Member.find({}).populate([{path :'vehicle'},{path:'profile'}]);
  } catch (error) {
    console.error("Error fetching members:", error);
    throw new Error("Failed to fetch members");
  }
};

exports.createMember = async (memberData) => {
  try {
    return await Member.create(memberData);
  } catch (error) {
    console.error("Error creating member:", error);
    throw new Error("Failed to create member");
  }
};
exports.updateMember= async (memberId, newData)=> {
  console.log("member",memberId);
  console.log("data",newData);
  try {
    const updatedMember = await Member.findByIdAndUpdate(memberId, newData, { new: true }).populate('vehicle');
    return updatedMember;
  } catch (error) {
    throw new Error(`Failed to update member: ${error.message}`);
  }
}

