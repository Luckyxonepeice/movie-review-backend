const {sendError} = require("../utils/helper");
const {isValidObjectId} = require("mongoose");
const PasswordResetToken= require("../models/passwordResetToken");
exports.isValidPassResetToken = async (req,res,next) => {
    const {token,userId} = req.body;
    
    if(!token.trim() || !isValidObjectId(userId)){
         return sendError(res,'Invalid request!')
    }

    const resetToken= await PasswordResetToken.findOne({owner : userId});

    if(!resetToken) {
        return sendError(res,'unauthorized Access, Invalid request!')
    }

    const matched= await resetToken.compareToken(token);
    if(!matched){
        return sendError(res,'unauthorized access , Invalid request!')
    }

    req.resetToken= resetToken;
    next();

}
