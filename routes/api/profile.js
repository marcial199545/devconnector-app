const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const User = require("../../models/User");
const { validationResult, check } = require("express-validator");
// @route   GET api/profile/me
// @desc    get current user profile
// @access  Private
router.get("/me", auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate("user", ["name", "avatar"]);
        if (!profile) {
            return res.status(400).json({ msg: "There is no profile for this user" });
        }
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("server error");
    }
});
// @route   POST api/profile
// @desc    create or update a user profile
// @access  Private
router.post(
    "/",
    [
        auth,
        [
            check("status", "status is required")
                .not()
                .isEmpty(),
            check("skills", "Skills is required")
                .not()
                .isEmpty()
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;
        //NOTE build profile object
        const profileFields = {};
        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills = skills.split(",").map(skill => skill.trim());
        }
        //NOTE initialize social fields object
        profileFields.social = {};
        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;
        try {
            let profile = await Profile.findOne({ user: req.user.id });
            //NOTE update
            if (profile) {
                profile = await Profile.findOneAndUpdate({ user: req.user.id }, { $set: profileFields }, { new: true });
                return res.json(profile);
            }
            //NOTE create
            profile = new Profile(profileFields);
            await profile.save();
            res.json(profile);
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Server error");
        }
        res.send("hello");
    }
);
// @route   GET api/profile
// @desc    get all profiles
// @access  Public
router.get("/", async (req, res) => {
    try {
        const profiles = await Profile.find().populate("user", ["name", "avatar"]);
        res.json(profiles);
    } catch (error) {
        console.error(erorr.message);
        res.status(500).send("server error");
    }
});
// @route   GET api/profile/user/:user_id
// @desc    get profile by user id
// @access  Public
router.get("/user/:user_id", async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate("user", ["name", "avatar"]);
        if (!profile) {
            res.status(400).send("Profile not found");
        }
        res.json(profile);
    } catch (error) {
        console.error(error.message);
        if (error.kind === "ObjectId") {
            res.status(400).send("Profile not found");
        }
        res.status(500).send("server error");
    }
});
module.exports = router;
