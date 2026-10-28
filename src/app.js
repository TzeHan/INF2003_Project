const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const PORT = 3000;
const createTables = require('./models/initDb');
const generateData = require('./models/dataGen');

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'..', 'views'));
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(session({
  secret: 'movie_secret_key',
  resave:false,
  saveUninitialized:false,
  cookie:{
    secure:false
  }
}));

const indexRoutes = require('./routes/index');
const movieRoutes = require('./routes/movies');
const userRoutes = require('./routes/user');

app.use('/', indexRoutes);
app.use('/movies',movieRoutes);
app.use('/users', userRoutes);

const start = async () => {
  await createTables();
  await generateData();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

start();