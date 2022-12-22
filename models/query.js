const mongoose = require('mongoose');
const Status = require('./status')
const Schema = mongoose.Schema;

const QuerySchema = new Schema({
    question: String,
    image: String,
    description: String,
    statuss: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Status'
        }
    ]
});

QuerySchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Status.deleteMany({
            _id: {
                $in: doc.statuss
            }
        })
    }
})

module.exports = mongoose.model('Query', QuerySchema);
