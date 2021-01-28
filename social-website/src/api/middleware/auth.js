 const jwt = require('jsonwebtoken');

 const auth = (req,res,next) =>{
    try{
        const token = req.headers.authorization.split(" ")[1];
        // console.log(token);
        const decode = jwt.verify(token,'mykey')
        req.userData = decode;
        next();
    }catch(err){
        res.status(401).json({error:"Token invalid"});
    }
 }

 module.exports = auth;