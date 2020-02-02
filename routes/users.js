var express = require('express');
var router = express.Router();
const userController = require("../controllers/userController");
const { User } = require("../models/user");
const {
    validateUserReg,
    validateUserLogin,
    passwordChange
} = require("../validations/user-validation");

const { encrypt } = require("../helpers/encryption")
const auth = require("../middleware/auth");
const { verifyToken, generateToken } = require("../helpers/generate-token");


/* GET users listing. 
use controllers
user named http-status
*/
router.get('/', userController.index);




// Register a new user
router.post("/register", userController.register);

router.get("/verify/:token/account", async(req, res) => {

    let user, decoded;

    try {
        decoded = verifyToken(req.params.token);
    } catch (error) {
        return res.status(401).send(error.message);
    }

    try {
        user = await User.findOne({ email: decoded.email }).select('verified');
        if (!user) return res.status(404).send("User was not found.");
    } catch (error) {
        return res.status(401).send(error.message);
    }

    if (user.verified) return res.status(401).send("User already verified.");

    try {
        userStatus = await User.updateOne({ _id: decoded._id }, { verified: true });
        if (userStatus.ok) return res.status(200).send("Token have been successfully verified.");
    } catch (error) {
        return res.status(401).send(error.message);
    }

});

router.put('/token/regenerate/', async(req, res) => {
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

router.put('/change/password/', auth, async(req, res) => {
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

router.delete('/delete/account/', auth, async(req, res) => {
    try {
        const user = await User.deleteOne({ _id: req.user._id });
        if (!user) return res.status(400).send("User could not be deleted.");

        res.send(user);
    } catch (error) {
        return res.status(401).send(error.message);
    }
});



module.exports = router;