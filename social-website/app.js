var express = require('express');
var bodyParser = require('body-parser');
// api routes
var Api = require('./src/api/app');
var Posts = require('./src/api/posts');
var Users = require('./src/api/users');

const app = express();
// Data base connection code
require("./src/db/connection");

const port = process.env.PORT || 5000; 

app.use(bodyParser());

app.use('/api/user',Users);
app.use('/api',Api);
app.use('/api/user/timeline',Posts);

app.get('/',(req,res) => {
    res.send("this is main");
})

app.use((req,res,next) => {
    next(createError(404));
})

app.use((err,req,res,next) =>{
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.json({error:err.status});
})

app.listen(port,()=>{
    console.log("Server is up on port : " + port);
})
