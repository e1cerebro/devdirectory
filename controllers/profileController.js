const { User } = require("../models/user");
const { validateBio } = require("../validations/user-validation");
const { process_request, asyncMiddleware } = require("../helpers/process-request")


exports.me = asyncMiddleware(async(req, res) => {
    const user = await User.findOne({ _id: req.user._id }).select('-_id -password -profile._id');
    if (!user) return res.status(404).send("User was not found.");
    res.send(user);
});

exports.search = asyncMiddleware(async(req, res) => {

    user = await User.find({ name: req.params.name });
    res.send(user);
});

exports.create = asyncMiddleware(async(req, res) => {

    let user;

    const { error } = validateBio(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    user = await User.lookup(req.user.email);
    if (!user) return res.status(401).send("Your account was not found.");

    if (!user.verified) return res.status(401).send("Please verify you account.");

    user.profile = {
        "user": user._id,
        "gender": req.body.gender,
        "country": req.body.country,
        "age": req.body.age,
        "stacks": req.body.stacks,
        "bio": req.body.bio,
    };

    await user.save();

    res.status(201).send(user);
});

exports.delete = asyncMiddleware(async(req, res) => {

    let user;

    user = await User.findOne({ _id: req.user._id });
    if (!user) return res.status(401).send("Your account was not found.");

    if (!user.profile) return res.status(401).send("We could not find your profile.")

    user.profile = undefined;

    await user.save();

    res.send(user);
});