const express = require("express");
const router = express.Router();
const foodController= require('../controllers/foodcontroller');


router.get('/food',(req,res)=>{
    res.render('food')
});


module.exports = router;