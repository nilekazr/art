'use strict';
const bcrypt = require('bcrypt');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.user.belongsToMany(models.art, { through: "userArts"})
    }

    // compares entered password to hashed password (runs on login)
    validPassword(passwordTyped) {
      return bcrypt.compareSync(passwordTyped, this.password)
    }

    // remove hashed password from user object (before serializing)
    toJSON() {
      let userData =this.get()
      // removes hashed password from userData object (doesn't delete from database)
      delete userData.password
      return userData
    }
  };
  user.init({
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Invalid email address.'
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [1, 40],
          msg: 'Name must be between 1 and 99 characters.'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8, 99],
          msg: 'Password must be between 8 and 99 characters.'
        }
      }
    } 
  }, {
    sequelize,
    modelName: 'user',
  });

  user.beforeCreate( (pendingUser, options) => {
    // if a user exists and if that user has a password
    if (pendingUser && pendingUser.password) {
      // hash password with bcrypt
      let hash = bcrypt.hashSync(pendingUser.password, 12)
      // store hash as user's password
      pendingUser.password = hash
    }
  })

  return user;
};