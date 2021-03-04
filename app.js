const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");

const register = require("./routes/register");
const auth = require("./routes/auth");
const notice = require("./routes/notice");
const test = require("./routes/test");


require("dotenv").config();

const app = express();

mongoose.connect("mongodb://localhost/TestProject", {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> console.log("Connected to database"))
.catch((error)=> console.log(error));

app.use(bodyParser.urlencoded({extended: false}));

app.use('/uploads', express.static(__dirname + 'uploads'));

app.use(bodyParser.json());

// const directory = path.join(__dirname, 'public');
// app.use("/uploads", express.static(directory));

app.use("/register", register);
app.use("/login", auth);
app.use("/notices", notice);
app.use("/test", test);

app.listen(process.env.PORT, ()=>{console.log(`listening to port ${process.env.PORT}`)});