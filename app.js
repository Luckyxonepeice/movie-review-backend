const express=require("express");
const { errorHandler } = require("./middleware/error");
const cors= require("cors");
//For handling the errors
require("express-async-errors");
require("dotenv").config();
//User router
const userRouter=require("./routes/user");
const actorRouter=require("./routes/actor");
const movieRouter = require("./routes/movie");
const reviewRouter = require("./routes/review");
const adminRouter = require("./routes/admin");
const { handleNotFound } = require("./utils/helper");
require("./db") // by default index.js is exported


const app=express();
app.use(cors());
app.use(express.json()); //so able to read data in body req convert into json format
app.use("/api/user",userRouter);
app.use("/api/actor",actorRouter);
app.use("/api/movie", movieRouter);
app.use("/api/review", reviewRouter);
app.use("/api/admin", adminRouter);
app.use('/*',handleNotFound);
//Handles the error
app.use(errorHandler);


app.listen(5000,()=>{
    console.log("You are in the Port 5000")
});


