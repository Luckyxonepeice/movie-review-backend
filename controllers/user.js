const EmailVerificationToken = require("../models/emailVerificationToken");
const passwordResetToken = require("../models/passwordResetToken");
const nodemailer= require('nodemailer');
const jwt= require("jsonwebtoken");

const User = require("../models/user"); 

const { isValidObjectId } = require("mongoose");
const { generateOTP,generateMailTransporter} = require("../utils/mail");
const { sendError, generateRandomByte } = require("../utils/helper");


exports.create= async (req,res)=>{
    const {name, email, password} = req.body;
    const oldUser= await User.findOne({email});
    if(oldUser){
        return sendError(res,"Already user with this email!");
    }
    const newUser= new User({name,email,password});
    await newUser.save();

    // Generate 6 digit otp
    const OTP = generateOTP();
    console.log(OTP);

    //Store otp inside our db
    const newEmailVerificationToken=new EmailVerificationToken({
        owner:newUser._id, 
        token:OTP
    })
    await newEmailVerificationToken.save();


    res.status(201).json({
        user:{
            id:newUser._id,
            namee:newUser.name,
            email:newUser.email
        }
    })
}

//Verification of email and OTP
exports.verifyEmail= async (req, res)=>{
    const {userId, OTP} = req.body;

    //checking is valid userId or not
    if( !isValidObjectId(userId)) {
        return sendError(res,"Invalid UserId");
    }

    const user= await User.findById(userId);

    if(!user){
         return sendError(res,"user not found",404);
    }
    //checking for verification
    if(user.isVerified){
        return sendError(res,"User is already verified");
    }

    const token = await EmailVerificationToken.findOne({ owner : userId})

    if(!token){
        return sendError(res,"Token not found");
    }

    //checking if OTP is valid or not
    const isMatched = await token.compareToken(OTP)
    
    if(!isMatched) {
        return sendError(res,'please submit a valid OTP!');
    }
    user.isVerified= true;
    await user.save();
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    
    await EmailVerificationToken.findByIdAndDelete(token._id);
    res.json({
        user:{id: user._id, name:user.name , email: user.email,token:jwtToken, isVerified: user.isVerified ,
        role: user.role},
        message:"Your email is verified",
    });

}

//for resending new OTP if(time>1 hour) else same otp required.
exports.resendEmailVerification = async (req,res)=>{
    const {userId} = req.body;

    const user= await User.findById(userId);

    if(!user){
         return sendError(res,"user not found",404);
    }
    //checking for verification
    if(user.isVerified){
        return sendError(res,"User is already verified"); 
    }

    const alreadyHasToken = await EmailVerificationToken.findOne({ owner : userId})

    if(alreadyHasToken){
        return sendError(res,"Only after 1 hour you can request another token");
    }

    const OTP = generateOTP();
    console.log(OTP);


    //Store otp inside our db
    const newEmailVerificationToken=new EmailVerificationToken({
        owner:user._id,
        token:OTP
    })
    await newEmailVerificationToken.save();


    res.status(201).json({message:"OTP has been resend to your Email!"})

}


exports.forgetPassword= async (req,res) => {
    const {email} = req.body;
    
    if(!email) return sendError(res,"email is missing!");

    const user= await User.findOne({email});
    if(!user) return sendError(res,"User not found",404);

    const alreadyHastoken= await  passwordResetToken.findOne({owner:user._id});

    if(alreadyHastoken) return sendError(res,"Only after one hour you can request for another token!");
    
    //generating random byte using the cyrpto package
    const token= await generateRandomByte();
    const newPasswordResetToken = await passwordResetToken({
        owner:user._id,
        token
    });
    

    await newPasswordResetToken.save();

    const resetPasswordUrl= `http://localhost:3000/auth/reset-password?token=${token}&id=${user._id}`;
    
    console.log(resetPasswordUrl);


    res.json({message:'Link sent to your mail'});

}

exports.sendResetPasswordTokenStatus = (req,res) =>{
    res.json({valid:true});
}

exports.resetPassword =  async (req,res) =>{
    const {newPassword,userId} = req.body;

    const user = await User.findById(userId);
    const matched= await user.comparePassword(newPassword);
    
    if(matched){
        return sendError(res,"The new password must be different from the old one!");
    }

    user.password= newPassword;
    await user.save();

    await passwordResetToken.findByIdAndDelete(req.resetToken._id);

    res.json({message : "Password reset Successfully!, now you can change password"});

}
exports.signIn = async (req,res) =>{
    const {email,password}= req.body;

    const user =await User.findOne({email});
    if(!user){
        console.log("!");
        return sendError(res,"Email/Password mismatch");
    } 
        

    const matched= await user.comparePassword(password);
    if(!matched) return sendError(res,"Email/Password mismatch!")

    const {_id,name , isVerified , role }=user;
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

    res.json({user: {id: _id, name, email, role,token : jwtToken, isVerified, role}});

}
