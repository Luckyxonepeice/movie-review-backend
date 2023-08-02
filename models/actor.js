const mongoose=require("mongoose")
const bcrypt=require('bcrypt');
//const actor = require("c:/users/laksh/downloads/section-08-updating-actor/udemy-review-backend-08-video-113-updating-actor/models/actor");

const actorSchema= mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    about: {
        type: String,
        trim: true,
        required: true,
    },
    gender: {
        type: String,
        trim: true,
        required: true,
    },

    avatar: {
        type : Object,
        url : String,
        public_id: String,

    }
},{timestamps: true});

actorSchema.index({name : 'text'});


module.exports=mongoose.model("Actor",actorSchema)