import express from 'express'
import exphbs from 'express-handlebars'
import methodOverride from 'method-override'
const PORT = process.env.PORT || 3000
const app = express()
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(express.urlencoded({ extended: true }))
app.use(express.static('publics'))
app.use(methodOverride('_Method'))
app.get('/', (req, res) => {
  res.send('<h1>happy kyaru</h1>')
})
app.get('/users/login', (req, res) => {
  res.render('login')
})
app.post('/users/login', (req, res) => {
  res.send('<h1>post login</h1>')
})
app.get('/users/register', (req, res) => {
  res.render('register')
})
app.post('/users/register', (req, res) => {
  res.send('<h1>post register</h1>')
})
app.get('/users/logout', (req, res) => {
  res.send('<h1>users/logout</h1>')
})
app.listen(PORT, () => {
  console.log(`Sever start at PORT:${PORT}`)
})
