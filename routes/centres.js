const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const { centreSchema } = require('../schemas.js');
const { querySchema } = require('../schema.js');
const { isLoggedIn } = require('../middleware');

const ExpressError = require('../utils/ExpressError');
const Centre = require('../models/centre');
const Query = require('../models/query');
const trainer = require('../models/centre');

const validateCentre = (req, res, next) => {
    const { error } = centreSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

const validateQuery = (req, res, next) => {
    const { error } = querySchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}


router.get('/', catchAsync(async (req, res) => {
    const centres = await Centre.find({});
    res.render('centres/index', { centres })
}));

router.get('/new', isLoggedIn, (req, res) => {
    res.render('centres/new');
})


//queries
router.get('/q', catchAsync(async (req, res) => {
    const queries = await Query.find({});
    res.render('centres/queries', { queries })
}));

router.get('/newq', isLoggedIn, (req, res) => {
    res.render('centres/newq');
})


router.post('/s', isLoggedIn, validateQuery, catchAsync(async (req, res, next) => {
    const query = new Query(req.body.query);
    await query.save();
    req.flash('success', 'Successfully made a new query!');
    res.render(`/centres/queries`)
}))












router.post('/', isLoggedIn, validateCentre, catchAsync(async (req, res, next) => {
    const centre = new Centre(req.body.centre);
    await centre.save();
    req.flash('success', 'Successfully made a new centre!');
    res.redirect(`/centres/${centre._id}`)
}))

router.get('/:id', catchAsync(async (req, res,) => {
    const centre = await Centre.findById(req.params.id).populate('statuss');
    if (!centre) {
        req.flash('error', 'Cannot find that centre!');
        return res.redirect('/centres');
    }
    res.render('centres/show', { centre });
}));

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const centre = await Centre.findById(req.params.id)
    if (!centre) {
        req.flash('error', 'Cannot find that centre!');
        return res.redirect('/centres');
    }
    res.render('centres/edit', { centre });
}))

router.put('/:id', isLoggedIn, validateCentre, catchAsync(async (req, res) => {
    const { id } = req.params;
    const centre = await Centre.findByIdAndUpdate(id, { ...req.body.centre });
    req.flash('success', 'Successfully updated centre!');
    res.redirect(`/centres/${centre._id}`)
}));

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Centre.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted centre')
    res.redirect('/centres');
}));

module.exports = router;