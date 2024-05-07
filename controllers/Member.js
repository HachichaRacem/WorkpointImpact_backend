// controllers/memberController.js
const memberService = require("../services/Member.js");

exports.getAllMembers = async (req, res) => {
  try {
    const allMembers = await memberService.getAllMembers(req, res);
    return res.json(allMembers);
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

exports.updateMember=async(req, res)=> {
  const memberId = req.params.id; 
  const newData = req.body; 

  try {
    const updatedMember = await memberService.updateMember(memberId, newData);
    res.status(200).json(updatedMember);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};