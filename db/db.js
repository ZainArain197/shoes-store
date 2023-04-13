let mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect('mongodb://127.0.0.1:27017/shoe_store', (err, connection) => {

    console.log(connection || err);

});