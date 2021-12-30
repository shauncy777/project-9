'use strict';

const { Model, DataTypes } = require('sequelize');
var bcrypt = require('bcryptjs');

// Defines the User model
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    // Helper method for defining associations
    static associate(models) {
      
    // Establishes one-to-many association 
    User.hasMany(models.Course, {
      foreignKey: {
        fieldName: 'userId',
        allowNull: false,
      }
  });
}
  };
  User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A first name is required.',
          },
        notEmpty: {
            msg: 'Please provide a first name.',
      }
    },
        
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A last name is required.',
          },
        notEmpty: {
          msg: 'Please provide a last name.',
        }
      },   
    },
    emailAddress: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: {
            msg: 'That email already exists.'
        },
        validate: {
          notNull: {
            msg: 'An email is required.',
            },
          isEmail: {
            msg: 'Please provide a valid email address.',
        }
      },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'A password is required.',
            },
          notEmpty: {
            msg: 'Please provide a password.',
        }
      },
      set(val) {
        // Make certain password has appropriate amount of characters 
        if (val.length < 8 || val.length > 20) {
          throw Error('The password should be between 8 and 20 characters.');
        }
        // Sets provided password to hashedPassword
        const hashedPassword = bcrypt.hashSync(val, 10);
        this.setDataValue('password', hashedPassword);
      },        
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};