var express = require('express');
const {User} = require("../models/reg");
const bcrypt = require('bcrypt');
var router = express.Router();
const multer = require('multer');
const checkAuth = require('./middleware/auth');

var storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,'./public/uploads')
    },
    filename:(req,file,cb) => {
        cb(null,Date.now()+file.originalname)
    }
})

var upload = multer({storage:storage})


router.get("/",(req,res,next) =>{
    const data = User.find({});
    data.exec()
    .then(doc => {
        res.status(201).json({
            message:"OK",
            data:doc
        });
    })
    .catch(err =>{
        res.json(err);
    })
              
});


 router.put("/user/update/",upload.single('profileImage'),checkAuth,async (req,res,next) =>{
    let id = req.userData.userid;
    var myData =  {
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        email:req.body.email,
        mobile:req.body.mobile,
        image:req.file.path
    }

    await User.findById(id,(err,data) => {
        data.firstname = myData.firstname ? myData.firstname : data.firstname;
        data.lastname = myData.lastname ? myData.lastname : data.lastname; 
        data.email = myData.email ? myData.email : data.email;
        data.mobile = myData.mobile ? myData.mobile : data.mobile;
        data.image = myData.image ? myData.image : data.image;
        data.save()
        .then(doc => {
            res.status(201).json({
                message:"success",
                results:doc
            })
        })
        .catch(err => {
            res.json(err);
        })

    });

 });


 router.patch("/user/update_password",checkAuth,async (req,res,next) =>{
    let id = req.body._id;
    const myPassword = req.body.password;  
    const newPassword = req.body.newpassword;
    const confirmPassword = req.body.confirmpassword;
    if(newPassword === confirmPassword){
        await User.findById(id,(err,data) => {
            bcrypt.compare(myPassword,data.password,(err,result) => {
                if(err){
                    res.json({message:"Falied try again"})
                }else if(result){
                    bcrypt.hash(myPassword,10,(err,hash)=>{
                        if(err){
                            res.json({message:"Failed"})
                        }else{
                            data.password = hash;
                            data.save()
                            .then(doc =>{
                                res.status(201).json({
                                    message:"success",
                                    results:doc
                                })
                            })
                            .catch(err => {
                                res.json(err);
                            })
                        }
                    })
                    
                }
            })
    
        });
    }else{
        res.json({message:"Not matched"})
    }
    
 });


 router.delete("/user/delete",checkAuth,async (req,res,next) =>{
    let id  = req.body._id;
    await User.findByIdAndRemove(id)
    .then(doc =>{
        res.json({message:"Node js Rest api delete",results:doc});
    })
    .catch(err => {
        res.json(err)
    })
     
 });

 module.exports=router;


