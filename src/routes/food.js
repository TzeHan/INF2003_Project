const express = require("express");
const router = express.Router();
const foodController= require('../controllers/foodcontroller');


router.get('/food',foodController.getAllfood("food"));


module.exports = router;