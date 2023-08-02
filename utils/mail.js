const nodemailer= require('nodemailer');
exports.generateOTP = (otp_length=6)=>{
    // Generate 6 digit otp
    let OTP="";
    for(let i=1;i<=otp_length;i++){
        const randomVal=Math.round(Math.random()*9);
        OTP+=randomVal;
    }
    return OTP;
}

exports.generateMailTransporter =() =>{
    return nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "962caa87729900",
          pass: "e5af86ac5e5c38"
        }
    });
    
}