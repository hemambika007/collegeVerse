const mongoose = require('mongoose');
const Status = require('./status')
const Schema = mongoose.Schema;

const CentreSchema = new Schema({
    title: String,
    image: String,
    contact: Number,
    description: String,
    location: String,
    statuss: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Status'
        }
    ]
});

CentreSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Status.deleteMany({
            _id: {
                $in: doc.statuss
            }
        })
    }
})

module.exports = mongoose.model('Centre', CentreSchema);
