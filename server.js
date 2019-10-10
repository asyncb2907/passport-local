const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const config = require('config');
const passport = require('passport');

const app = express();

// passport config
require('./passport/passport')(passport);

// Connect MongoDB
mongoose.connect(config.get('mongoURI'), { useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log('MongoDB connected ...');
});

// Set view
app.set('views', './views');
app.set('view engine', 'ejs');

// Json middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set session
app.use(session({
    secret: 'nsfkjhdkf',
    maxAge: 3600 * 5,
    saveUninitialized: true,
    resave: true
}));

// passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash -- before combine route
app.use(flash());

// Combine routes
app.use('/', require('./routes/view.route'));
app.use('/api/', require('./routes/api.route'));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));