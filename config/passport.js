const passport = require('passport')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook')
const bcrypt = require('bcryptjs')
const db = require('../models') // 先進入models資料夾的index.js 它會幫我們import其他models
const User = db.User
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const facebookStrategy = new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK
},
async function (accessToken, refreshToken, profile, done) {
  try {
    const email = `${profile.id}@facebook.com`
    const name = profile.displayName
    const password = Math.random().toString(36).slice(-8)
    const [user, _] = await User.findOrCreate({
      where: { email },
      defaults: {
        name,
        email,
        password: bcrypt.hashSync(password, bcrypt.genSaltSync(10))
      }
    })
    return done(null, user)
  } catch (error) {
    return done(error, false)
  }
}
)

const localStrategy = new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
},
async function verify (req, email, password, done) {
  try {
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return done(null, false, req.flash('login_error', 'Email不存在'))
    }
    const validPassword = await bcrypt.compare(password, user.password)
    if (!validPassword) {
      return done(null, false, req.flash('login_error', '密碼不正確'))
    } else {
      // 成功登入
      return done(null, user)
    }
  } catch (error) {
    return done(error, false)
  }
})

module.exports = (app) => {
  app.use(passport.initialize())
  app.use(passport.session())
  passport.use(localStrategy)
  passport.use(facebookStrategy)
  passport.serializeUser(function (user, done) {
    done(null, user.id)
  })

  passport.deserializeUser(async function (id, done) {
    try {
      let user = await User.findByPk(id)
      user = user.toJSON()// 記得放json黨就好
      return done(null, user)
    } catch (error) {
      return done(error, false)
    }
  })
}
