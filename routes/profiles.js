const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth");
const profileController = require("../controllers/profileController");


router.get("/me", auth, profileController.me);

router.get('/search/:name', profileController.search);


router.post("/create", auth, profileController.create);


router.delete("/delete", auth, profileController.delete);

module.exports = router;