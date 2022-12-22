const express = require('express');
const router = express.Router({ mergeParams: true });

const Centre = require('../models/centre');
const Status = require('../models/status');

const { statusSchema } = require('../schemas.js');


const ExpressError = require('../utils/ExpressError');
const catchAsync = require('../utils/catchAsync');

const validateStatus = (req, res, next) => {
    const { error } = statusSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}



router.post('/', validateStatus, catchAsync(async (req, res) => {
    const centre = await Centre.findById(req.params.id);
    const status = new Status(req.body.status);
    centre.statuss.push(status);
    await status.save();
    await centre.save();
    req.flash('success', 'Created new status!');
    res.redirect(`/centres/${centre._id}`);
}))

router.delete('/:statusId', catchAsync(async (req, res) => {
    const { id, statusId } = req.params;
    await Centre.findByIdAndUpdate(id, { $pull: { statuss: statusId } });
    await Status.findByIdAndDelete(statusId);
    req.flash('success', 'Successfully deleted status')
    res.redirect(`/centres/${id}`);
}))

module.exports = router;