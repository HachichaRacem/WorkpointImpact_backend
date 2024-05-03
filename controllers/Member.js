// controllers/memberController.js
const memberService = require("../services/Member");

exports.getAllMembers = async (req, res) => {
  try {
    const allMembers = await memberService.getAllMembers();
    res.json(allMembers);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.createMember = async (req, res) => {
  try {
    const newMember = await memberService.createMember(req.body);
    res.json(newMember);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.updateMember = async (req, res) => {
  const { memberId } = req.params;
  const updateData = req.body;
  try {
    const updatedMember = await memberService.updateMember(memberId, updateData);
    res.json(updatedMember);
  } catch (error) {
    console.error("Controller error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
