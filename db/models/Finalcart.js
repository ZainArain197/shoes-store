let mongoose = require('mongoose');

let finalcartSchema = mongoose.Schema({

    discription: String,
    name: String,
    imgdata: String,
    price: Number,
    qnty: Number,
    

})

let Finalcart = mongoose.model("Finalcart", finalcartSchema);

module.exports = Finalcart;