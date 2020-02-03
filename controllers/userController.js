const { User } = require("../models/user");
const {
    validateUserReg,
    validateUserLogin,
    passwordChange
} = require("../validations/user-validation");
const { verifyToken, generateToken } = require("../helpers/generate-token");
const { encrypt } = require("../helpers/encryption")
const { process_request, asyncMiddleware } = require("../helpers/process-request")

exports.index = asyncMiddleware(async(req, res) => {
    const user = await User.find();
    if (!user) return res.status(200).send("No record was found");
    res.send(user);
});

exports.register = asyncMiddleware(async(req, res) => {

    //validate the request input
    const { error } = validateUserReg(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.lookup(req.body.email);
    if (user) return res.status(400).send("User with that email already exists.");

    //initialize the new user object
    let newUser = new User({
        "name": req.body.name,
        "email": req.body.email,
        "password": req.body.password //note passwords are encrypted in the pre post middleware
    });

    //save new user in the collection
    await newUser.save();

    res.status(201).send(newUser);
});


exports.verifyAccount = asyncMiddleware(async(req, res) => {

    let user, decoded;
    decoded = verifyToken(req.params.token);
    if (!decoded) return res.status(401).send("could not verify token.");

    user = await User.findOne({ email: decoded.email }).select('verified');
    if (!user) return res.status(404).send("User was not found.");

    if (user.verified) return res.status(401).send("User already verified.");

    userStatus = await User.updateOne({ _id: decoded._id }, { verified: true });
    if (userStatus.ok) return res.status(200).send("Token have been successfully verified.");

})


exports.generateToken = asyncMiddleware(async(req, res) => {

    //validate the login input
    const { error } = validateUserLogin(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //try to login the user
    const user = await User.login(req.body.email, req.body.password);
    if (!user) return res.status(401).send("Email or Password is incorrect.");

    if (!user.verified) return res.status(401).send("You need to verify your account first.");

    //regenrate the user token
    const token = generateToken(user);
    if (!token) return res.status(400).send("Could not generate token.");

    res.header("x-auth-token", token).send(token);

});


exports.changePassword = asyncMiddleware(async(req, res) => {
    //validate the login input
    const { error } = passwordChange(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const result = await User.confirmVerify(req.user);

    if (!result.verified) return res.status(401).send("You need to verify your account first.");

    const hashedPassword = await encrypt(req.body.password);

    const status = await User.updateOne({ _id: req.user._id }, { "password": hashedPassword })
    if (!status) return res.status(400).send("Password could not be changed.");

    res.send(status)
});

exports.deleteAccount = asyncMiddleware(async(req, res) => {
    const user = await User.deleteOne({ _id: req.user._id });
    if (!user) return res.status(400).send("User could not be deleted.");
    res.send(user);
});