const express = require('express');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

const User = require('../models/users');

router.get('/login', (req, res) => {
    res.render('login.ejs', { error: req.flash('error') });
});

router.get('/register', (req, res) => {
    res.render('register.ejs', { errors: [] });
});

router.post('/register', (req, res) => {
    const { name, username, password, password2 } = req.body;
    let errors = [];

    if(!name|| !username|| !password|| !password2) {
        errors.push('Please enter all fields');
    }

    if(password !== password2) {
        errors.push('Password not match');
    }

    if(errors.length > 0) {
        return res.render('register.ejs', { errors });
    }

    User.findOne({ username })
        .then(user => {
            if(user) {
                return res.render('register.ejs', { errors: ['User already exist'] });
            }

            const newUser = new User({
                name,
                username,
                password
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err;
                    newUser.password = hash;

                    newUser
                        .save()
                        .then(() => res.render('register.ejs', { errors: ['Register success'] }))
                        .catch(err => console.log(err));
                })
            });
        })
        .catch(err => console.log(err));
});


router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/profile',
        failureRedirect: '/api/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res) => {
    req.logOut();
    res.redirect('/api/login');
});

module.exports = router;