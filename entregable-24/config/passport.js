const { verifyPassword, createHash } = require("../utils/isValidPassword");
const User = require("../models/User");
const { Strategy: LocalStrategy } = require("passport-local");

initialize = (passport) => {
    passport.use(
        "login",
        new LocalStrategy(
            { usernameField: "email" },
            (email, password, done) => {
                console.log(email);
                User.findOne({ email }, (err, user) => {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        return done(null, false, { message: "User not found" });
                    }
                    if (!verifyPassword(password, user)) {
                        return done(null, false, {
                            message: "Password incorrect",
                        });
                    }
                    return done(null, user);
                });
            }
        )
    );

    passport.use(
        "register",
        new LocalStrategy(
            {
                usernameField: "email",
            },
            (email, password, done) => {
                console.log(email, password);
                return User.findOne({ email })
                    .then((user) => {
                        if (user) {
                            return done(null, false, {
                                message: "El nombre de usuario ya esta en uso.",
                            });
                        }

                        const newUser = new User({
                            email,
                            password: createHash(password),
                        });
                        // newUser.password = createHash(password);
                        // newUser.email = email;
                        return newUser.save();
                    })
                    .then((user) => {
                        return done(null, user);
                    })
                    .catch((err) => console.log(err));
            }
        )
    );
    passport.serializeUser((user, done) => done(null, user._id));

    passport.deserializeUser((id, done) => {
        console.log("deserializeUser");
        User.findById(id).then((user) => {
            done(null, user);
        });
    });
};

module.exports = initialize;
