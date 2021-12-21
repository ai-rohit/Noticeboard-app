// const mongoose = require("mongoose");

// mongoose.connect('mongodb://localhost/noticeboard', {useNewUrlParser: true, useUnifiedTopology: true})
// .then(()=> console.log("Connected to the database"))
// .catch(err=> console.log("Something went wrong"))

// const usersSchema = new mongoose.Schema({
//     name: String,
//     email: String,
//     password: String,
//     confirmPassword: String,
//     isRegistered: Boolean,
//     registeredDate: {type: Date, default: Date.now}
// });

// const User = mongoose.model("User", usersSchema);
// async function createUser(){
    

//     const user = new User({
//         name: "Amit Shrestha",
//         email: "shresthaamit553@gmail.com",
//         password: "12345amit",
//         confirmPassword: "12345amit",
//         isRegistered: false
//     })

//     const result = await user.save();
//     console.log(result);
// }

// async function getUser(){
//     const users = await User.find({
//        name:{$eq: "AmitShrestha"}, isRegistered: false
//     }).limit(2).sort({name: 1})
//     console.log("Users:",users); 
// }

// async function deleteUser(){
//     const result = await User.deleteMany({name:"RohitShrestha"});
//     console.log(result);
// }

// deleteUser();