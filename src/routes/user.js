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

router.get('/profile',(req,res)=>{
    if (!req.session.user) {
            return res.redirect('/login'); 
        }
    res.render('profile');
})

router.post('/updateProfile', userController.updateProfile)

router.get('/logout',userController.logout)

router.post('/login', userController.authenticateUser)

module.exports = router;