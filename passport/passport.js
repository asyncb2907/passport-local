const localStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');

const User = require('../models/users');

module.exports = function(passport) {
    passport.use(
        new localStrategy(
            function(username, password, done) {
                User.findOne({ username })
                    .then(user => {
                        if(!user) return done(null, false, { message: 'No account' });

                        bcrypt.compare(password, user.password, (err, isMatch) => {
                            if(err) throw err;

                            if(!isMatch) {
                                return done(null, false, { message: 'Wrong password' });
                            }

                            return done(null, user);
                        });
                    })
                    .catch(err => console.log(err));
            }
        )
    )

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
      
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
          done(err, user);
        });
    });
}