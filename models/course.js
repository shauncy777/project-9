'use strict';

const { Model, DataTypes } = require('sequelize');

// Defines the Course model
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    // Helper method for defining associations
    static associate(models) {

      // Establishes one-to-one association
      Course.belongsTo(models.User, {
        foreignKey: {
          fieldName: 'userId',
          allowNull: false,
        }
      });
    }
  };
  Course.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A title is required.',
          },
        notEmpty: {
          msg: 'Please provide a title',
      }
    },
  },
        
    description: {
      type: DataTypes.TEXT,
      allowNull: false,  
      validate: {
        notNull: {
          msg: 'A description is required.',
          },
        notEmpty: {
          msg: 'Please provide a description.',
    }
    },
  },
    estimatedTime: {
        type: DataTypes.STRING,
    },
    materialsNeeded: {
        type: DataTypes.STRING,       
    }
  }, {
    sequelize,
    modelName: 'Course',
  });
  return Course;
};