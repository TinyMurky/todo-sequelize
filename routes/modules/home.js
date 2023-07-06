const db = require('../../models') // 先進入models資料夾的index.js 它會幫我們import其他models
const Todo = db.Todo
const User = db.User
const express = require('express')
const router = express.Router()

router.get('/', async (req, res) => {
  const user = req.user
  try {
    const todos = await Todo.findAll({ raw: true, nest: true, where: { UserId: user.id } })
    res.render('index', { todos })
  } catch (error) {
    res.status(422).json(error)
  }
})
module.exports = router
