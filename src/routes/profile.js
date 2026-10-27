const express = require("express");
const router = express.Router();
const profileController= require('../controllers/profilecontroller');

router.get('/',profileController.profile);

module.exports = router;