const mongoose = require("mongoose");
mongoose.set('useFindAndModify',false);
const userSchema = new mongoose.Schema({
    
    username:{
        type:String,
        required:true,
        index:{unique:true}
    },
    firstname:{
        type:String,
        required:true
    },
    lastname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        index:{unique:true},
        match:/^[a-zA-Z0-9]+(\.[_a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*(\.[a-zA-Z]{2,15})$/
    },
    mobile:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    image:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    }

})

const User = new mongoose.model('User',userSchema);

// Schema for the posts

const postSchema = new mongoose.Schema({
    username:{
        type:String
    },
    posts:{
        type:String,
    },
    comments:{
        type:Array
    },
    likes:{
        type:Array
    },
    image:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now
    }

})

const Post = new mongoose.model('Post',postSchema);


module.exports = {User,Post};