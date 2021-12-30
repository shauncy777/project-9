'use strict';
const express = require('express');
const router = express.Router();
const { asyncHandler } = require('../middleware/asyncHandler.js');
const { authenticateUser } = require('../middleware/auth-user.js');
const {User} = require('../models');


// Returns properties and values for current authenticated user
router.get('/users',  authenticateUser, asyncHandler(async (req, res) => {
    const user =  req.currentUser;
    res.json({
      // Filtering out data that isn't needed
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress
    });
}));

// Creates a new user.
router.post('/users', asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      res.status(201).location('/').end();
    } catch (error) {
      if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
        const errors = error.errors.map(err => err.message);
        res.status(400).json({ errors });   
      } else {
        throw error;
      }
    }
}));

module.exports = router;