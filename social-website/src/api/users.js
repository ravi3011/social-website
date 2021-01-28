var express = require('express');
const {User} = require("../models/reg");
const bcrypt = require('bcrypt');
var router = express.Router();
const jwt = require('jsonwebtoken');
// const multer = require('multer');

// var storage = multer.diskStorage({
//     destination:(req,file,cb) => {
//         cb(null,'./public/uploads')
//     },
//     filename:(req,file,cb) => {
//         cb(null,Date.now()+file.originalname)
//     }
// })

// var upload = multer({storage:storage})

router.post("/login", async (req,res)=>{
    // console.log(req.body);
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;
        await User.findOne({username,email})
        .then(data => {
            if(data.length < 1){
                res.json({"message":"Failed","token":data});
            }else{
                bcrypt.compare(password,data.password,(err,result)=>{
                    if(err){
                        res.json({"message":"Auth Failed"})
                    }else if(result ){
                        const token = jwt.sign({username:username,userid:data._id},'mykey',{expiresIn:'10h'});
                        res.json({"message":"success","token":token,results:result});
                    }else{
                        res.json({"message":"Auth Failed"})
                    }
                })
                
            }
            
            })
        .catch(err => {
            res.json({error:err})
        })    
 });

//  register API

router.post("/register",(req,res)=>{
    // console.log(req.body);
    
        bcrypt.hash(req.body.password,10,(err,hash)=>{
            if(err){
                res.json({
                    message:"Something wrong try again",
                    error:err
                })
            }else{

            const mydata ={
                username:req.body.username,
                firstname:req.body.firstname,
                lastname:req.body.lastname,
                email:req.body.email,
                mobile:req.body.mobile,
                password:hash
            }    
            const data = new User(mydata);
            data.save()
            .then(doc => {
                res.status(201).json({
                    message:"Register Successfully",
                    results:doc
                });
            })
            .catch(err => {
                res.json(err);
            })
            }
        });
 });
 

module.exports=router;
