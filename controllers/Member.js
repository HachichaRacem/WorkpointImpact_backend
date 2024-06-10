const member = require("../models/member.js");
const memberService = require("../services/Member.js");
const jwt = require("jsonwebtoken");

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
exports.  signinAdmin = (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
    member.findOne({
      email: email,
    }).populate("profile").exec((err, user) => {
      console.log("user : ", user);
      if (err || !user) {
        return res.status(400).json({
          status: 400,
          message: "User with that email does not exist.",
        });
        // return res.status(400).json({
        //   errors: "User with that email does not exist. Please signup",
        // });
      }
      if (
        user &&
       user.profile.name !="ADMIN"

      ) {
        return res.status(400).json({
          status: 400,
          message:
            "Connection denied ! Your are not authorized to access to this plateform",
        });
      }
      // authenticate
      if (!user.authenticate(password)) {
        return res.status(400).json({
          status: 400,
          message: "Email and password do not match",
        });
        // return res.status(400).json({
        //   errors: "Email and password do not match",
        // });
      }
      console.log('user',user)
      
      // generate a token and send to client
      const token = jwt.sign(
        {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          profile: user.profile,
        },
        "actl",
        {
          // expiresIn: "1800s",
          expiresIn: "120s",
        }
      );
      const { fullName, email } = user;
      const refresh_token = jwt.sign(
        {
          id: user._id,
        },
        "azer",
        {
          expiresIn: "120s",
        }
      );
      console.log("tokeens in signin", { token, refresh_token });
      return res.json({
        token,
        user: {
          fullName,
          email,
        },
        refresh_token,
      });
    });
  
};
/*exports.requireSignin = (req, res, next) => {
  // const token =
  //   req.body.token || req.query.token || req.headers["x-access-token"];
  const token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).json({
      errors: "A token is required for authentication",
    });
  } else {
    
      console.log('token',token)
      jwt.verify(token,"actl" , async (err, decodedToken) => {
        if (err) {
          console.log('err',err)
          return res.status(401).json("Invalid or expired token");
        } else {
          
          req.user = decodedToken;
          return next();
        }
      });
    
  }
};*/

