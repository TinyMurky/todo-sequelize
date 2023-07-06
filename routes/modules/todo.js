const db = require('../../models') // 先進入models資料夾的index.js 它會幫我們import其他models
const Todo = db.Todo
const User = db.User

const express = require('express')
const router = express.Router()

router.get('/new', async (req, res) => {
  res.render('new', {})
})
router.post('/', async (req, res) => {
  try {
    const name = req.body.name
    const user = req.user
    await Todo.create({ name, UserId: user.id })
    res.redirect('/')
  } catch (error) {
    res.status(422).json(error)
  }
})
router.put('/:id', async (req, res) => {
  try {
    const user = req.user
    const id = parseInt(req.params.id)
    let { isDone, name } = req.body
    isDone = isDone === 'on'
    await Todo.update({ isDone, name }, {
      where: {
        id,
        UserId: user.id
      }
    })
    res.redirect('/')
  } catch (error) {
    res.status(422).json(error)
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const user = req.user
    const id = parseInt(req.params.id)
    await Todo.destroy({ // 會是soft delete
      where: {
        id,
        UserId: user.id
      }
      // force: true // force: true 變成直接remove
    })

    await Todo.restore({
      where: {
        id: 4
      }
    })

    res.redirect('/')
  } catch (error) {
    res.status(422).json(error)
  }
})

router.get('/:id/edit', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const user = req.user
    const todo = await Todo.findOne({ where: { id, UserId: user.id } })
    res.render('edit', { todo: todo.toJSON() })
  } catch (error) {
    res.status(422).json(error)
    // HTTP 422 狀態碼表示伺服器理解請求實體的內容類型，並且請求實體的語法是正確的，但是伺服器無法處理所包含的指令。
  }
})
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
    const user = req.user
    console.log(typeof user.id)
    const todo = await Todo.findOne({ where: { id, UserId: user.id } })
    res.render('detail', { todo: todo.toJSON() })
  } catch (error) {
    res.status(422).json(error)
    // HTTP 422 狀態碼表示伺服器理解請求實體的內容類型，並且請求實體的語法是正確的，但是伺服器無法處理所包含的指令。
  }
})
module.exports = router
