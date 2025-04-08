const express = require('express');
const CourseRouter = express.Router();
const CourseSchema = require('../Models/course');
const UserSchema = require('../Models/user');
const auth = require('../middleware/auth');


CourseRouter.get('/' , async function(req,res){
    try{
        const courses = await CourseSchema.find().populate('creatorId' , 'username profile')
        res.json(courses)
    }catch(err){
        res.status(500).json({message:err.message})
    }
});

CourseRouter.post('/' , async function(req,res){
    if(req.user.role !=='creator'){
        return res.status(403).json({message:"only creators can create the course!"})
    }

    const course = new Course({
        title:req.body.title,
        description:req.body.description,
        price: req.body.price,
        creatorId: req.user._id,
        category: req.body.category,
        thumbnail: req.body.thumbnail,
        content: req.body.content || []
    })
})

CourseRouter.get('/:id' , async function(req,res){
    try{
        const course = await CourseSchema.findById(req.params.id).populate('creatorId' , 'username profile').populate('ratings.userId', 'username profile');

        if(!course){
            return res.status(404).json({message:"Course not found"});
        }
        res.json(course);
    }catch(err){
        res.status(500).json({message:err.message})
    };
})

CourseRouter.put('/:id' , async function(req,res){
    try{
        const course = await CourseSchema.findById(req.params.id);
        if(!course){
            return res.json({message:"Course not found"}).status(404)
        }

        if(course.creatorId,toString() !== req.user._id.toString()){
            return res.status(403).json({message:"You can only update your courses only!"})
        }

        if (req.body.title) course.title = req.body.title;
        if (req.body.description) course.description = req.body.description;
        if (req.body.price) course.price = req.body.price;
        if (req.body.category) course.category = req.body.category;
        if (req.body.thumbnail) course.thumbnail = req.body.thumbnail;
        if (req.body.content) course.content = req.body.content;

        const updatedCourse = await course.save();
        res.json(updatedCourse)
    }catch (err) {
        res.status(400).json({ message: err.message });
      }
});

CourseRouter.post('/:id/enroll' , async function(req,res){
    try{
        const course = await CourseSchema.findById(req.params.id);
        if(!course) return res.status(404).json({message:"Course not found"});

        const user = await UserSchema.findById(req.user._id)
        if(user.purchasedCourses.includes(req.params.id)){
            res.json({message:"User already enrolled in the course!"}).status(400);
        }

        user.purchasedCourses.push(req.params.id);
        await user.save();

        course.studentsEnrolled+=1;
        await course.save();

        res.json({message:"Enrolled successfully"})
    }catch (err) {
        res.status(500).json({ message: err.message });
      }
})

module.exports={
    CourseRouter
}