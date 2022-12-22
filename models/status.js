const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const statusSchema= new Schema({
    body:String,
    rating:Number
});

module.exports = mongoose.model("Status",statusSchema);