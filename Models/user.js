const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const UserSchema = new Schema({
    email:{type:String , unique:true , required :true},
    password:{type:String , required:true},
    role:{type:String , enum : ['student' , 'creator'] , default:'student'},
    purchasedCourses:[{
        type:ObjectId,
        ref:'Course'
    }],
    profile:{
        fullName:String,
        bio:String,
        avatar:String
    }
})

const UserModel = mongoose.model('User' , UserSchema)

module.exports={
    UserModel
}


// THIS FILE DEFINES THE USER SCHEMA FOR DATABASE , IT HAS ROLE WHICH DIFFERENTIATS BETWEEN USER AND CREATOR 