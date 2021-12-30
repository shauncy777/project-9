'use strict';

const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const { asyncHandler } = require('../middleware/asyncHandler.js');
const { authenticateUser } = require('../middleware/auth-user.js');
const {User, Course} = require('../models');


// Route that returns courses
router.get('/courses',  asyncHandler( async (req, res) => {
    const course = await Course.findAll({
       include: [{
           model: User,
           as: 'User',
           attributes: {
               exclude: ['password','createdAt','updatedAt']
           }
       }],
       attributes: {
           exclude: ['createdAt', 'updatedAt']
       }
    });
    if (course) {
        res.status(200).json(course)
    } else {
        res.status(404).json({ message: "No courses were found." })
    }
}));

// Route that returns specific course
router.get('/courses/:id', asyncHandler( async (req, res) => {
    const course = await Course.findByPk(req.params.id, {
        include: [{
            model: User,
            as: 'User',
            attributes: {
                exclude: ['password','createdAt','updatedAt']
            }
        }],
        attributes: {
            exclude: ['createdAt', 'updatedAt']
        }
    });
    if (course) {
        res.status(200).json(course)
    } else {
        res.status(404).json({ message: "No course was found." })
    }
}));

// Route to create a new course 
router.post('/courses', authenticateUser, asyncHandler(async (req,res) => {
    const newCourse = req.body;
    try {
        const course = await Course.create(newCourse);
        const { id } = course;
        res.status(201).location(`/courses/api/${course.id}`).end(); 
    }
    catch (error){
        if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
            const errors = error.errors.map(err => err.message);
            res.status(400).json({ errors });   
        } else {
            throw error;
        }
    }
}));

// Route for updating a course
router.put('/courses/:id', authenticateUser, asyncHandler( async(req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (course.userId === req.currentUser.id) {
            if (course) {
                await course.update(req.body);
                res.status(204).json({"message": "Course has been updated"}).end();
            } else {
                res.status(404).json({"message": "Course does not exist"}).end();
            }
        } else {
            res.status(403).json({"message": "Access Denied. User does not have access to complete this action"}).end();
        }

    } catch (error) {
        if(error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError'){
            const errors = error.errors.map(error => error.message);
            res.status(400).json({ errors });
        } else {
            throw error
        }
    }
}));

// Route for deleting a course
router.delete('/courses/:id', authenticateUser, asyncHandler(async(req, res) => {
    const user = req.currentUser;
    const course = await Course.findByPk(req.params.id);
    if (course){
        if (course.userId === user.id){
            await course.destroy();
            res.status(204).end();
        } else {
            res.status(403).json({"message": "Access Denied. User does not have acces to complete this action"}).end();
        } 
    } else {
        res.status(404).json({"message": "Page not found"});
    }
}));

module.exports = router;