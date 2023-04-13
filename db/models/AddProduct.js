let mongoose = require('mongoose');

let productSchema = mongoose.Schema({
    discription: String,
    name: String,
    imgdata: String,
    price: Number,
    qnty: Number,
    stock:Number
})

let Product = mongoose.model("AddProduct", productSchema);

module.exports = Product;