const express = require('express');
const mongoose = require('mongoose');
const {authRouter} = require('./Routes/auth')
const {CourseRouter} = require('./Routes/courses')
const connectDB = require('./Config/db');
require('dotenv').config()

connectDB();

const app = express();

app.use(express.json());

app.use('/api/auth' , authRouter );
app.use('/api/courses' , CourseRouter) ;

const PORT = process.env.PORT || 5000;

app.listen(PORT , function(){
    console.log(`server is running on port ${PORT}`)
})
/* 
this is main file of our node express server and it basically imports all the other required functions here and execute them 

*/