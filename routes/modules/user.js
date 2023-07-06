const db = require('../../models') // 先進入models資料夾的index.js 它會幫我們import其他models
const User = db.User
const passport = require('passport')
const bcrypt = require('bcryptjs')
const express = require('express')
const router = express.Router()

router.get('/login', (req, res) => {
  res.render('login', { })
})
router.post('/login', (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password) {
    req.flash('login_error', '請填寫所有欄位')
    return res.redirect('/users/login')
  }
  next()
},
passport.authenticate('local', {
  failureRedirect: '/users/login',
  failureFlash: true // 讓沒有密碼時錯誤訊息可以傳出來
}),
(req, res) => {
  res.redirect('/')
})
router.get('/register', (req, res) => {
  res.render('register')
})
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body
    const errors = []
    if (!(name && email && password && confirmPassword)) {
      errors.push({ message: '須填寫所有欄位' })
    }
    const user = User.findOne({ where: { email } })
    if (!user && email) { // 防止空email找到東西時使用
      errors.push({ message: '此信箱已登記過' })
    }
    if (password !== confirmPassword) {
      errors.push({ message: '您的密碼與確認密碼不相符' })
    }
    if (errors.length) {
      return res.render('register', { name, email, password, confirmPassword, errors })
    }
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    await User.create({ name, email, password: hash })
    req.flash('success_msg', '您已成功註冊')
    res.redirect('/users/login')
  } catch (error) {
    res.status(422).json(error)
  }
})

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) { return next(err) }
    req.flash('success_msg', '您已成功登出')
    res.redirect('/users/login')
  })
})
module.exports = router
