const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const Centre = require('./models/centre');
const Query = require('./models/query');
// const Trainer = require("./models/trainer");
const userRoutes = require('./routes/users');
const centreRoutes = require('./routes/centres');
const statusRoutes = require('./routes/statuss');

mongoose.connect('mongodb://127.0.0.1:27017/STUDENTS')
.then(()=>{console.log("Mongoose Connection open!!!")})
.catch(err=>{
    console.log('Oh No!! mongoose connection error!!');
    console.log(err)
});

const app = express();

app.engine('ejs',ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret: 'thisshouldbeabettersecret!',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
// passport.use('user',new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.session)
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes);
app.use('/centres', centreRoutes)
app.use('/centres/:id/statuss', statusRoutes)

// app.get('/',async (req, res) => {
//     const trainer = await Trainer.findById(req.params.id);
//     res.render('home',{trainer})
// });



app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

app.get("/users/:id", async(req,res)=>{
    const userr = await User.findById(req.params.id);
    res.redirect("users/chat",{userr})
    // res.send("hello andi")
  })


const http = require('http').createServer(app)
const PORT = process.env.PORT || 3001
http.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})
 
const io = require('socket.io')(http)
io.on('connection', (socket) => {
    console.log('Connected...')
    socket.on('message', (msg) => {
        socket.broadcast.emit('message', msg)
    })
})


// app.listen(3000, () => {
//     console.log('Serving on port 3000')
// })