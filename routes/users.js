var express = require('express');
var router = express.Router();
const config = require('config');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require("../models/user");
const { validateUserReg } = require("../validations/user-validation");

/* GET users listing. */
router.post('/', function(req, res, next) {
    res.send('respond with a resource');
});


router.post("/register", async function(req, res, next) {
    //validate the request input
    const { error } = validateUserReg(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ "email": req.body.email });
    //console.log("user", user);
    if (user) return res.status(400).send("User with that email already exists");

    const userObj = {
        "name": req.body.name,
        "email": req.body.email
    };

    //configure new user object
    let newUser = new User(userObj);

    //encrypt password
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //add hashed password to the newUser object
    newUser.password = hashedPassword;

    //save new user
    await newUser.save();

    const key = config.get("jwtPrivateKey");
    var token = jwt.sign(userObj, key);

    res.header({ 'x-auth-token': token }).status(201).send(newUser);

});

module.exports = router;