const Sequelize = require('sequelize')
const sequelize = require('../util/database')

// here we define the class itself
// to see how to define a model, the docs can be referred to
const User = sequelize.define('user', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  name: {
      type: Sequelize.STRING,
      allowNull: false
  },
  email: {
      type: Sequelize.STRING,
      allowNull: true
  }
})

module.exports = User
