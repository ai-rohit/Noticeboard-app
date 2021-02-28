const express = require("express");
const mongoose = require("mongoose");
const register = require("./routes/register");
const auth = require("./routes/auth");

const app = express();

mongoose.connect("mongodb://localhost/TestProject", {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=> console.log("Connected to database"))
.catch((error)=> console.log(error));

app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.use("/register", register);
app.use("/login", auth);


app.listen(8000, ()=>{console.log("listening to port 8000")})