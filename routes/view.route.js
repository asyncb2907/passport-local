const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('home.ejs');
});

router.get('/profile', (req, res) => {
    if(req.isAuthenticated()) {
        res.render('profile.ejs', { name: req.user.name });
    } else {
        res.redirect('/api/login');
    }
});

module.exports = router;