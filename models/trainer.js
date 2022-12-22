const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const TrainerSchema = new Schema({
    
    email:String,
    // age: Number,
    // DOB: Date,
    
})
TrainerSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('Trainer',TrainerSchema);