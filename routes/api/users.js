const express = require("express");
const router = express.Router();
const { check, validationResult } = require("express-validator");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
const User = require("../../models/User");

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post(
    "/",
    [
        check("name", "Name is required")
            .not()
            .isEmpty(),
        check("email", "Please add a valid email").isEmail(),
        check("password", "Please enter a password with 6 or more characters").isLength({
            min: 6
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const { name, email, password } = req.body;

        //NOTE check if the user exist
        try {
            let user = await User.findOne({ email });
            if (user) {
                return res.status(400).json({ errors: [{ msg: "Email provided is al ready assigned to a user" }] });
            }
            //NOTE create avatar
            const avatar = gravatar.url(email, {
                s: "200",
                r: "pg",
                d: "identicon"
            });
            //NOTE create new instace of the user model
            user = new User({ name, email, avatar, password });

            //NOTE hashing the password and assign user.password to hashed value
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);

            //NOTE save the user into mongodb
            await user.save();

            //NOTE use json web token
            const payload = {
                user: {
                    id: user.id
                }
            };
            jwt.sign(payload, config.get("jwtSecret"), { expiresIn: 360000 }, (err, token) => {
                if (err) throw err;
                res.json({ token });
            });
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server error");
        }
    }
);
module.exports = router;
