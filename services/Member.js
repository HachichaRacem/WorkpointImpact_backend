// services/memberService.js
const Member = require("../models/Member");

exports.getAllMembers = async () => {
  try {
    return await Member.find({});
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

exports.updateMember = async (memberId, updateData) => {
  try {
    return await Member.findByIdAndUpdate(memberId, { $set: updateData }, { new: true });
  } catch (error) {
    console.error("Error updating member:", error);
    throw new Error("Failed to update member");
  }
};
