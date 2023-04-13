let mongoose = require('mongoose');


let userSchema = mongoose.Schema({
   username:String,
    password:String,
    email:String,
    type:String,

  
})

let User = mongoose.model("user", userSchema);

module.exports =User;