const mongoose = require('mongoose');

const urlPath = "mongodb://localhost:27017/social_app";

mongoose.connect(urlPath,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
    useCreateIndex:true
}).then(()=>{
    console.log("connection successful");
}).catch((e) =>{
    console.log("not connected");
})