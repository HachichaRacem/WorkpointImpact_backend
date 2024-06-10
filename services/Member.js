
const Member = require("../models/member");
const profile = require("../models/profile");
var generator = require("generate-password");
const nodemailer = require('nodemailer');

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
    console.log('memberData',memberData)
    //const newMember = await Member.create(memberData);
    const profileUser = await profile.findById(memberData.profile)
    if(profileUser.name == "ADMIN"){
      var password = generator.generate({
        length: 6,
        numbers: true,
        // characters: true,
      });
      var newData = {...memberData,password:password,passwordText:password}
      //const newMember = await Member.create(newData);
      const newMember = new Member({
        password:password,email:memberData.email,fullName:memberData.fullName,profile:memberData.profile,passwordText:password
      })
      await newMember.save()
      console.log('newMember',newMember)
      console.log('password',password)
      await sendAdminNotification(memberData.email, password);
      return newMember
    }
    else{const newMember = await Member.create(memberData);
      return newMember
    }
    
  } catch (error) {
    console.error("Error creating member:", error);
    throw new Error("Failed to create member");
  }
};
const sendAdminNotification = async (email, password) => {
  try {
    
    const transporter = nodemailer.createTransport({
      service: 'gmail', 
      auth: {
        user: 'taher1.ghrab@gmail.com', 
        pass: 'tyhuqrkpmsmuvuqe' 
      }
    });

    
    const mailOptions = {
      from: process.env.SMTP_USER, 
      to: email, 
      subject: 'Crampe ya fariss', 
      text: `dear Firas ,

You have been assigned as an admin. Here are your credentials:

Email address: ${email}
Password: ${password}

Please change your password after logging in for the first time.

Best regards,
Your Team`
    };

    
    await transporter.sendMail(mailOptions);
    console.log('Admin notification email sent to:', email);
  } catch (error) {
    console.error('Error sending email:', error);
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

