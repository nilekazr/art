'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class art extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.art.belongsToMany(models.user, {through: "userArts"})
    }
  };
  art.init({
    contentId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    artistName: DataTypes.STRING,
    artistUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'art',
  });
  return art;
};