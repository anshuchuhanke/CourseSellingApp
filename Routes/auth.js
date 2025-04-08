const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const {z, boolean} = require('zod');

const {UserModel} = require('../Models/user')

const JWT_USER = 'userSign';
const authRouter = express.Router(); // this router handles requests and makes it easier to manage routes with same prefix

authRouter.post('/register' , async function(req,res){
    //this function uses zod's object to validate all the info 
    const requiredBody = z.object({
        email:z.string().email(),
        firstName:z.string(),
        lastName:z.string(),
        password:z.string()
    })

    //this function safeParse returns object containing data after successful validation and throws error if validation fails but doesn't crash the app
    // safeparse here is applied on requiredbody object and takes input from req.body and thus validates/parses data and is stored in variable parseddata
    //defining required body is just as defining schema and not validating inputs , validating happens when we call safeparse which returns object success or error

    const parsedData = requiredBody.safeParse(req.body);


    async function existingUserfxn(req,res){
        //we are finding the user with provided email in our database if it already exists
       const existingUser =  await User.findOne({email:parsedData.data.email});
        if (existingUser){
            return res.status(400).json({
                message:"Email already exists!"
            })
        }
    }

    const hashedPass = await bcrypt.hashSync(parsedData.data.password , 10);

    const newUser = await UserModel.create({
        email: parsedData.data.email,
        password: hashedPass,
        firstName: parsedData.data.firstName,
        lastName: parsedData.data.lastName,
        role: parsedData.data.role
    });

    return res.status(201).json({
        message: "User registered successfully",
        user: {
            id: newUser._id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            role: newUser.role
        }
    });

})

authRouter.post('/signin' , async function(req,res){
    const {email , password} = req.body;

    const user = await UserModel.findOne({email:email});

    if(!user){
        res.status(400).json({message:"User not found in our databse!"})
    }

    //user.password refers to the password which is already hashed and stored in our database
    const passMatch = await bcrypt.compare(password,user.password)

    if(passMatch){
        const token = jwt.sign({
            _id: user._id, role: user.role
        },process.env.JWT_USER)
        res.header('authToken' , token).send({token , user})
    }else{
        res.status(401).json({message:"Invalid credentials"})
    }
})

module.exports={
    authRouter
}
// THIS FILE HANDLES ROUTES FOR AUTHENTICATION AND DOES VALIDATION CHECKS 
