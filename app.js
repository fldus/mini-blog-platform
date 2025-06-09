const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const loginRoutes = require('./routes/login');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {secure: false}
}));
app.use('/login', loginRoutes);

app.get('/', (req, res) => {
  res.render('index')
})
app.use((req, res) => {
  res.status(404).send('404 not found');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});