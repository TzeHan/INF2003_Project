const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;
const createTables = require('./models/initDb');

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'..', 'views'));
app.use(express.static(path.join(__dirname, '..', 'public')));

const indexRoutes = require('./routes/index');
const movieRoutes = require('./routes/movies');
const userRoutes = require('./routes/user');

app.use('/', indexRoutes);
app.use('/movies',movieRoutes);
app.use('/users', userRoutes);

const start = async () => {
  await createTables();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

start();