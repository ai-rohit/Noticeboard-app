const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const register = require("./routes/register");
const auth = require("./routes/auth");
const notice = require("./routes/notice");

const redis = require("redis");

require("dotenv").config();

const app = express();

mongoose.connect("mongodb://localhost/Noticeboard", {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
.then(()=> console.log("Connected to database"))
.catch((error)=> console.log(error.message));

const client = redis.createClient(6379)
client.on('connect', () => { 
    console.info('Redis connected!');
  }
)
client.on('ready', () => {
    console.log('Redis ready');
  });
// client.set('foo', 'bar', (err, reply) => {
//     if (err) throw err;
//     console.log(reply);

//     client.get('foo', (err, reply) => {
//         if (err) throw err;
//         console.log(reply);
//     });
// });

client.on('error', (err)=> console.log(err));

app.use(bodyParser.urlencoded({extended: false}));

app.use('/uploads', express.static('uploads'));

app.use(bodyParser.json());

app.use("/api/register", register); 
app.use("/api/login", auth);
app.use("/api/notices", notice);
app.use("/api/groups", require("./routes/group"))

app.use(require("./middlewares/errorHandler"));
app.listen(process.env.PORT, ()=>{console.log(`listening to port ${process.env.PORT}`)});