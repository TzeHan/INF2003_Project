const userQuery = require('../models/userModel');

exports.getUsers = async(req,res)=>{
    try{
        const users = await userQuery.findAll();
        res.render('index', {users});
    }
    catch(err){
        console.error(err);
        res.status(500).render('error',{error: 'Error'})
    }
};

exports.getUserbyid = (viewName)=>
        async(req,res)=>{
            try{
                const user = await userQuery.findById(req.params.id);
                res.render(viewName,{user})
            }
            catch(err){
                console.error(err);
                res.status(500).render('error',{error:'Error'})
            }
};

exports.createUser = async(req,res)=>{
    try{
        const{name,phone,email,password,cfmpassword,dob} = req.body;

        if(password !== cfmpassword){
            return res.status(400).render("register",{error:"password does not match."});
        }

        else{
            const new_User = {
                name:name,
                phone_num:phone,
                email:email,
                password:password,
                date_of_birth:dob
            };
            const result = await userQuery.create(new_User);
            res.redirect('/login');
        }
        
    }
    catch(err){
        console.error(err);
        res.status(500).render('error',{error:'Error'})
    }
};

exports.authenticateUser = async(req,res)=>{
    try{
        const {email, password} = req.body;
        const user_Cred = {
            email:email,
            password:password
        };
        const result = await userQuery.findByEmailAndPassword(user_Cred);
        if (!result) { 
            return res.status(401).render('login', { error: "Invalid credentials" });
        }
        else{
            req.session.user = result;
            res.redirect('/');
        }
    }
    catch(err){
        console.error(err);
        res.status(500).render('error',{error:'Error'});
    }
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).send("Could not log out");
        }

        res.clearCookie('connect.sid'); 
        console.log("SESSION DESTROYED. Current session:", req.session); 
        res.redirect('/');
    });
};