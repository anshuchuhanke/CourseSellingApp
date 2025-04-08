const jwt = require('jsonwebtoken');
const UserSchema = require('../Models/user');
const {UserModel} = require('../Models/user')

function auth(req,res,next){
    try{
        const token = req.header('Authorization');
        if(!token){
            return res.status(401).json({message:"No token , authorization denied"});
        }

        //we are able to compare role here because we gave role also as a payload while signing the token and hence when its decoded it returns user id and its role
        const decoded = jwt.decode(token)
        if(!decoded || !decoded._id || !decoded.role){
            return res.status(401).json({message:"Invalid token format!"})
        }

        let secret;
        if(decoded.role==='creator'){
            secret=process.env.JWT_CREATOR;
        }else{
            secret=process.env.JWT_USER;
        }

        //we are verifying token here using secret depending upon if its user or creator

        const verified = jwt.verify(token,secret)

        UserModel.findOne({_id:decoded._id} , function(err,user){
            if(err || !user){
                res.status(401).json({message:"User not found"})
            }
            if (user.role !== decoded.role) {
                return res.status(401).json({ message: "Role mismatch" });
            }
            req.user=user;
            req.token=token;

            next();
        });
    }catch (err) {
        console.error('Authentication error:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
      }
    }

    //another middleware for creator verification
    function isCreator(req,res,next){
      if(req.user.role !== 'creator'){
          return res.status(403).json({message:"Creator role required hence denied!"})
      }
      next();
    }

module.exports={
    auth:auth,
    isCreator:isCreator

}