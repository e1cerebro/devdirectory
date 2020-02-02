const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const { User } = require("../models/user");
const { validateBio } = require("../validations/user-validation");


router.get("/me", auth, async(req, res) => {
    const user = await User.findOne({ _id: req.user._id }).select('-_id -password -profile._id');
    if (!user) return res.status(404).send("User was not found.");

    res.send(user);
});

router.get('/search/:name', async(req, res, next) => {
    user = await User.find({ name: req.params.name });
    res.send(user);
});


router.post("/create", auth, async(req, res) => {

    let user;

    try {
        user = await User.lookup(req.user.email);
        if (!user) return res.status(401).send("Your account was not found.");
    } catch (error) {
        console.log(error);
    }

    if (!user.verified) return res.status(401).send("Please verify you account.");

    const { error } = validateBio(req.body);

    if (error) {
        console.log(error.details[0].message);
        return res.status(400).send(error.details[0].message);
    }

    user.profile = {
        "user": user._id,
        "gender": req.body.gender,
        "country": req.body.country,
        "age": req.body.age,
        "stacks": req.body.stacks,
        "bio": req.body.bio,
    };

    try {
        await user.save();
    } catch (error) {
        console.log(error)
    }
    res.status(201).send(user);
});


router.delete("/delete", auth, async(req, res) => {
    let user;
    try {
        user = await User.findOne({ _id: req.user._id });
        if (!user) return res.status(401).send("Your account was not found.");

    } catch (error) {
        console.log(error);
    }

    if (!user.profile) return res.status(401).send("We could not find your profile.")

    user.profile = undefined;

    await user.save();

    res.send(user);

});

module.exports = router;