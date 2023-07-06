'use strict'
const bcrypt = require('bcryptjs')
const { QueryTypes } = require('sequelize')
const SEED_USER = [{
  name: 'root',
  email: 'root@example.com',
  password: '12345678'
}, {
  name: 'user1',
  email: 'user1@example.com',
  password: '12345678'
}]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const newUsers = SEED_USER.map((user) => {
      return {
        name: user.name,
        email: user.email,
        password: bcrypt.hashSync(user.password, bcrypt.genSaltSync(10)),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    })

    await queryInterface.bulkInsert('Users', newUsers, { returning: ['id'] })
    const userIds = await queryInterface.sequelize.query('SELECT id FROM Users', { type: QueryTypes.SELECT })
    // [ { id: 19 }, { id: 20 } ]
    const newTodos = []
    userIds.forEach((userId) => {
      for (let i = 0; i < 10; i++) {
        const newTodo = {
          name: `name-${i}`,
          isDone: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: userId.id
        }
        newTodos.push(newTodo)
      }
    })
    await queryInterface.bulkInsert('Todos', newTodos, { returning: ['id'] })
    // console.log('User id:', userIds)

    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('Todos', null, {})// 要先delete 不然先delete user會噴錯Cannot delete or update a parent row
    await queryInterface.bulkDelete('Users', null, {})
  }
}
