const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const CourseSchema = new Schema({
    title:{type:String , required:true},
    price:{type:Number , required:true},
    description:{type:String,required:true},
    creatorId:{type:ObjectId,ref:'user',required:true},
    
})

const CourseModel = mongoose.model('Course' , CourseSchema)
module.exports={
    CourseModel
}