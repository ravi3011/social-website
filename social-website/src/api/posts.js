var express = require('express');
const {Post} = require("../models/reg");
var router = express.Router();
const checkAuth = require('./middleware/auth');

// require('../../public/uploads')
const multer = require('multer');

var storage = multer.diskStorage({
    destination:(req,file,cb) => {
        cb(null,'./public/uploads')
    },
    filename:(req,file,cb) => {
        cb(null,Date.now()+file.originalname)
    }
})

var upload = multer({storage:storage})

// From here post api calling

router.get("/posts",(req,res) =>{
    const data = Post.find({});
    data.exec()
    .then(doc =>{
        res.json({"message":"OK",data:doc});
    })
    .catch(err => {
        res.json(err);
    })
})

router.post("/add-post",upload.single('postImage'),checkAuth,(req,res) =>{
    console.log(req.userData);
    const userPost = {username:req.userData.username,posts:req.body.userpost,image:req.file.path};
    const data = new Post(userPost);
    data.save()
    .then(doc =>{
        res.json({"message":"OK",results:doc});
    })
    .catch(err => {
        res.json(err);
    })
})

router.patch("/update-posts",checkAuth,async (req,res) =>{
    const postId = req.body.post_id;
    const newPost = req.body.userpost;

    await Post.findById(postId,(err,data) => {
        data.posts = newPost ? newPost : data.posts;
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

    });
    
})

router.patch("/post/comment",checkAuth,async (req,res) =>{
    const post_id = req.body.post_id;
    await Post.findByIdAndUpdate(post_id,{$push:{comments:{$each:[{"comment":req.body.comment,"user_id":req.body.user_id}]}}})    
    .then(doc =>{
        res.json({"message":"OK",results:doc});
    })
    .catch(err => {
        res.json(err);
    })
    
})

router.patch("/like-post",checkAuth,async (req,res) =>{
    const post_id = req.body.post_id;
    console.log(post_id);
    console.log(req.body.like_id);
    const result = await Post.findByIdAndUpdate(post_id,{$push:{"likes":{$each:[req.body.like_id]}}})
        result.save()
        .then(doc => {
            const totallike = doc.likes.length;
            console.log(totallike)
            res.json({"message":"Like added",likes:totallike});
        }).catch(err => {
        res.json(err);
    })
    
})


module.exports=router;
