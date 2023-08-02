const express=require('express');
const { createActor, updateActor, removeActor, searchActor, getLatestActor, getSingleActor , getActors} = require('../controllers/actor');
const router=express.Router();
const {uploadImage} = require("../middleware/multer");
const { validate, actorInfoValidator} = require('../middleware/validator');
const { isAuth, isAdmin } = require('../middleware/auth');


router.post('/create',isAuth, isAdmin,uploadImage.single("avatar"), actorInfoValidator, validate, createActor);


router.post('/update/:actorId',isAuth, isAdmin,uploadImage.single("avatar"), actorInfoValidator, validate, updateActor);
 
router.delete("/:actorId",isAuth, isAdmin, removeActor);

router.get("/search",isAuth, isAdmin, searchActor);

router.get("/latest-uploads", isAuth, isAdmin,getLatestActor);

router.get("/single/:id", getSingleActor);

router.get("/actors", isAuth, isAdmin, getActors);

module.exports=router;
