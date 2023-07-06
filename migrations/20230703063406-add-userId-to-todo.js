'use strict'
const { DataTypes } = require('sequelize')
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Todos', 'UserId', {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users', // 請使用table name
        key: 'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Todos', 'UserId')
  }
}
