'use strict';

const auth = require('basic-auth');
const bcrypt = require('bcryptjs');

const { User } = require('../models');

exports.authenticateUser = async (req, res, next) => {
    // Parse the user's credentials from the Authorization header.
    const credentials = auth(req);

    let message; 

   
    if (credentials) {
        const user = await User.findOne({ where: {emailAddress: credentials.name}}); 
        if (user) {
            const authenticated = bcrypt
                .compareSync(credentials.pass, user.password);
            if (authenticated) { // if the passwords match
                console.log(`Authentication successful for email: ${user.emailAddress}`);
                
                // Storing the user on the request object
                req.currentUser = user;
            } else {
                message = `Authentication failure for email: ${user.emailAddress}` ;
            }
        } else {
            message = `User not found for ${credentials.name}`;
        }
    } else {
        message = 'Auth header not found';
    }

    if (message) {
        console.warn(message);
        res.status(401).json({ message: 'Access Denied' });
    } else {
        next();
    } 
}