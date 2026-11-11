const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admincontroller');

router.get('/food/add',(req,res)=>{
    res.render('createfood');
});

router.get('/movie/add',(req,res)=>{
    res.render('createfood');
});

router.get('/editFood',(req,res)=>{
    res.render('editfood', food={id:1});
});

module.exports = router;