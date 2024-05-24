const member = require("../models/member.js");
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
exports.signinAdmin = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const firstError = errors.array().map((error) => error.msg)[0];
    return res.status(422).json({
      errors: firstError,
    });
  } else {
    // check if user exist
    member.findOne({
      email,
    }).populate("profile").exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          status: 400,
          message: "User with that email does not exist.",
        });
        // return res.status(400).json({
        //   errors: "User with that email does not exist. Please signup",
        // });
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
      // generate a token and send to client
      const token = jwt.sign(
        {
          id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          Email: user.Email,
          admin: user.admin,
        },
        process.env.JWT_SECRET,
        {
          // expiresIn: "1800s",
          expiresIn: "1d",
        }
      );
      const { firstname, lastname, Email } = user;
      const refresh_token = jwt.sign(
        {
          id: user._id,
        },
        process.env.JWT_ADMIN_SECRET_REFRESH,
        {
          expiresIn: "4d",
        }
      );
      User.updateOne(
        {
          _id: user._id,
        },
        {
          last_connection: moment().format(),
          // isLoggedOut: false,
        }
      )
        .then(() => {
          console.log("updated");
        })
        .catch((e) => {
          console.log(e);
        });
      console.log("tokeens in signin", { token, refresh_token });
      return res.json({
        token,
        user: {
          firstname,
          lastname,
          Email,
        },
        refresh_token,
      });
    });
  }
};