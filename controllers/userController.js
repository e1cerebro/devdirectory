const { User } = require("../models/user");
const {
    validateUserReg,
    validateUserLogin,
    passwordChange
} = require("../validations/user-validation");

const process_request = function(callback) {
    try {
        callback()
    } catch (error) {
        return res.status(401).send(error.message);
    }
}

exports.index = (req, res, next) => {

    process_request(async() => {
        const user = await User.find();
        if (!user) return res.status(200).send("No record was found");
        res.send(user);
    })
}

exports.register = async(req, res, next) => {
    //validate the request input
    const { error } = validateUserReg(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    try {
        //check if the user exists
        const user = await User.lookup(req.body.email);
        if (user) return res.status(400).send("User with that email already exists");
    } catch (error) {
        return res.status(401).send(error.message);
    }


    //initialize the new user object
    let newUser = new User({
        "name": req.body.name,
        "email": req.body.email,
        "password": req.body.password //note passwords are encrypted in the pre post middleware
    });

    //save new user in the collection
    await newUser.save();

    res.status(201).send(newUser);

}