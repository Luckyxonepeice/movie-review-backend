const mongoose=require("mongoose")
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URI).
then( ()=>{
    console.log("Db is connected!")
}).
catch( (err)=>{
    console.log("Error found!",err)
})

