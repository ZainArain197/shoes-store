let mongoose = require('mongoose');


let OtpSchema = mongoose.Schema({
    email: String,
    code:String


})

let Otp = mongoose.model("Otp", OtpSchema);

module.exports = Otp;