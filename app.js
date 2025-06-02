const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
const loginRoutes = require('./routes/login');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));
app.use('/login', loginRoutes);

app.use((req, res) => {
  res.status(404).send('404 not found');
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.listen(port, () => {
  console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});