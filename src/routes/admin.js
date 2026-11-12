const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admincontroller');

const multer = require('multer');
const path = require('path');

const upload = multer({ dest: path.join(__dirname, '..', '..', 'public', 'images') });

router.get('/food/add',adminController.getFoodPage);

router.post('/food/add', upload.single('image'),adminController.addFood);

router.get('/movie/add',(req,res)=>{
    if (!req.session.user || req.session.user.type_id != 2) {
            return res.send('access denied.'); 
        }
    res.render('admin_create_movie');
});

router.get('/food/edit/:id',adminController.getFoodDetail)

router.post('/food/edit', upload.single('image'), adminController.updateFood);

router.get('/movie/edit/:id',adminController.getMovieDetail);

router.post('/admin/movie/edit', upload.single('image'),adminController.updateMovie);

module.exports = router;