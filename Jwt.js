const jwt =require('jsonwebtoken');

const jwtmiddleware =(req,res,next)=>{
   // console.log(req.headers.authorization);
    //validated  req.header.authorization
    const authorizarion = req.headers.authorization;
    if(!authorizarion) return res.status(401).json({error: "Token not Found"});

    const token = req.headers.authorization.split(" ")[1];
    if(!token) return res.status(401).json({error: "JWT unauthorized."});

    try{
        //verify JWT token
      const decode=  jwt.verify(token,process.env.JWT_salt);
      //attach user info to req object
      req.jwtpayload=decode;
      next();

    }
    catch(err){
        console.log(err);
        res.status(401).json({error: "Invalid token"})
        next(err);

    }

}

// generate token
const generateJWTToken =(userdata)=>{
return jwt.sign(userdata,process.env.JWT_salt,{expiresIn:30000});
}

module.exports={jwtmiddleware,generateJWTToken};