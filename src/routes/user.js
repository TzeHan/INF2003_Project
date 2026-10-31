const express = require('express');
const router = express.Router();
const userController = require('../controllers/usercontroller');

router.get('/users', userController.getUsers);

router.get('/register',(req,res)=>{
    res.render('register');
});

router.post('/register',userController.createUser);

router.get('/login',(req,res)=>{
    res.render('login');
});

router.post('/login', userController.authenticateUser)

module.exports = router;