const express = require("express");
const mongoose = require("mongoose");
const register = require("./routes/register");
const auth = require("./routes/auth");
const test = require("./routes/test");

require("dotenv").config();

const app = express();

mongoose.connect("mongodb://localhost/TestProject", {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> console.log("Connected to database"))
.catch((error)=> console.log(error));

app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.use("/register", register);
app.use("/login", auth);
app.use("/test", test);

app.listen(process.env.PORT, ()=>{console.log(`listening to port ${process.env.PORT}`)});