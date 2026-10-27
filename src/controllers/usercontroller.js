const userQuery = require('../models/userModel');

exports.getUsers = async(req,res)=>{
    try{
        const users = await userQuery.findAll();
        res.render('index', {users});
    }
    catch(err){
        console.error(err);
        res.status(500).json({error: 'Error'})
    }
};

exports.getUserbyid = (viewName)=>
        async(req,res)=>{
            try{
                const user = userQuery.findById(req.params.id);
                res.render(viewName,{user})
            }
            catch(err){
                console.error(err);
                res.status(500).json({error:'Error'})
            }
};

exports.createUser = async(req,res)=>{
    try{
        const{name,phone,email,password,cfmpassword,dob} = req.body;

        if(password !== cfmpassword){
            return res.status(400).send("Password does not match!");
        }

        else{
            const new_User = {
                name:name,
                phone_num:phone,
                email:email,
                password:password,
                date_of_birth:dob
            };
            const result = userQuery.create({new_User});
            res.redirect('/login');
        }
        
    }
    catch(err){
        console.error(err);
        res.status(500).json({error:'Error'})
    }
};