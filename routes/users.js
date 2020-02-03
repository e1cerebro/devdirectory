var express = require('express');
var router = express.Router();
const userController = require("../controllers/userController");
const auth = require("../middleware/auth");

router.get('/', userController.index);
router.post("/register", userController.register);
router.get("/verify/:token/account", userController.verifyAccount);
router.put('/token/regenerate/', userController.generateToken);
router.put('/change/password/', auth, userController.changePassword);
router.delete('/delete/account/', auth, userController.deleteAccount);

module.exports = router;