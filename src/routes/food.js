const express = require("express");
const router = express.Router();
const foodController= require('../controllers/foodcontroller');



router.get('/food/:id',foodController.getAllfood("food"));

router.post('/addToCart',foodController.addToCart);

router.get('/cart',foodController.getCart);

router.post('/cart/update',foodController.updateQty);

module.exports = router;