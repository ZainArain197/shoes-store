let mongoose = require('mongoose');

let OrderSchema = mongoose.Schema({
    firstname: String,
    email: String,
    address: String,
    city: String,
    state: String,
    zip: Number,
    cardname: String,
    cardnumber: String,
    expmonth: String,
    expyear: String,


})

let Order = mongoose.model("Order", OrderSchema);

module.exports = Order;