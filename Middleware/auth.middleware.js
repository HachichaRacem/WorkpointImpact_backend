const jwt = require('jsonwebtoken');
const User = require("../models/member");
console.log("JWT_SECRET:", process.env.JWT_SECRET);
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers["authorization"]?.split(' ')[1]; // Extract Bearer token
    if (!token) {
      return res.status(400).send({ errors: [{ msg: "Unauthorized" }] });
    }
    const decoded = await jwt.verify(token, process.env.JWT_SECRET); // Verify using the secret
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(400).send({ errors: [{ msg: "Unauthorized" }] });
    }
    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send({ errors: [{ msg: "Unauthorized" }] });
  }
};

module.exports = authMiddleware;
