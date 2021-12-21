const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const register = require("./routes/register");
const auth = require("./routes/auth");
const notice = require("./routes/notice");

require("dotenv").config();

const app = express();

mongoose.connect("mongodb://localhost/Noticeboard", {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
.then(()=> console.log("Connected to database"))
.catch((error)=> console.log(error.message));

app.use(bodyParser.urlencoded({extended: false}));

app.use('/uploads', express.static('uploads'));

app.use(bodyParser.json());

app.use("/register", register); 
app.use("/login", auth);
app.use("/notices", notice);

app.listen(process.env.PORT, ()=>{console.log(`listening to port ${process.env.PORT}`)});