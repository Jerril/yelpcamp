const express = require('express'),
    app = express(),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    flash = require('connect-flash'),
    passport = require('passport'),
    LocalStrategy = require('passport-local'),
    passportLocalMongoose = require('passport-local-mongoose'),
    Comment = require('./models/comments'),
    Campground = require('./models/campgrounds'),
    User = require('./models/user');

app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'));
app.use(flash());

// passport SETUP
app.use(require('express-session')({
    secret: 'Yelpcamp secret.',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// connect to mongoDB
mongoose.connect('mongodb://localhost:27017/yelpcamp', {useNewUrlParser: true, useUnifiedTopology: true});

// ROUTES
app.use(require('./routes/index'));
app.use('/campgrounds', require('./routes/campgrounds'));
app.use('/campgrounds/:id/comments', require('./routes/comments'));

let port = process.env.PORT || 3000;
app.listen(3000, () => {
    console.log(`YelpCamp has started. http://localhost:${port}`);
});