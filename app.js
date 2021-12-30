'use strict';

const {sequelize, User} = require('./models');
const userRoutes = require('./routes/userRoutes');
const courseRoutes = require('./routes/courseRoutes');

// Load modules
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

// Variable to enable global error logging
const enableGlobalErrorLogging = process.env.ENABLE_GLOBAL_ERROR_LOGGING === 'true';

// Create the Express app
const app = express();

// Body parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Setup morgan which gives us http request logging
app.use(morgan('dev'));

// Add routes
app.use('/api', userRoutes);
app.use('/api', courseRoutes);

// Setup request body JSON parsing.
app.use(express.json());

// Test database connection
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  try {
    await sequelize.sync();
    console.log('database synced');
  } catch (error) {
    console.log('Unable to sync the database', error);
  }
})();

// Send 404 if no other route matched
app.use((req, res) => {
  res.status(404).json({
    message: 'Route Not Found',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  if (enableGlobalErrorLogging) {
    console.error(`Global error handler: ${JSON.stringify(err.stack)}`);
  }

  res.status(err.status || 500).json({
    message: err.message,
    error: {},
  });
});

// Set port
app.set('port', process.env.PORT || 5000);

// Start listening to port
const server = app.listen(app.get('port'), () => {
  console.log(`Express server is listening on port ${server.address().port}`);
});
