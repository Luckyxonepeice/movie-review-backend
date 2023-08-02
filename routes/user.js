const express=require('express');
const { create, verifyEmail,resendEmailVerification, forgetPassword, sendResetPasswordTokenStatus, resetPassword, signIn} = require('../controllers/user'); 
const { isValidPassResetToken } = require("../middleware/user");
const {userValidator,validate, validatePassword, signInValidator}= require("../middleware/validator");
const { isAuth } = require('../middleware/auth');

const router=express.Router();
//-->    "/api/user"
router.post("/create",userValidator,validate,create);
router.post("/sign-in",signInValidator,validate,signIn);
router.post("/verify-email",verifyEmail);
router.post("/resend-email-verification-token",resendEmailVerification);
router.post("/forget-password",forgetPassword);

router.post("/verify-pass-reset-token",isValidPassResetToken,sendResetPasswordTokenStatus
)

router.post("/reset-password",validatePassword,validate,isValidPassResetToken,resetPassword);


router.get("/is-auth", isAuth, (req, res) => {
    const { user } = req;
    res.json({ user: { id: user._id, name: user.name, email: user.email, isVerified : user.isVerified
    , role: user.role} });
});
module.exports=router;