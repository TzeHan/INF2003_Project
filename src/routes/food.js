const express = require("express");
const router = express.Router();
const foodController= require('../controllers/foodcontroller');


router.get('/food/:id',foodController.getAllfood("food"));


module.exports = router;