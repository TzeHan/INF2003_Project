const express = require('express');
const app = express();
const path = require('path');
const session = require('express-session');
const PORT = 3000;
const createTables = require('./models/initDb');
const generateData = require('./models/dataGen');
const { connectToMongo } = require('./models/mongoConnection');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    next();
});

app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

const indexRoutes = require('./routes/index');
const movieRoutes = require('./routes/movies');
const userRoutes = require('./routes/user');
const adminRoutes = require('./routes/admin');
const foodRoutes = require('./routes/food')

app.use('/', indexRoutes);
app.use('/',movieRoutes);
app.use('/', userRoutes);
app.use('/', adminRoutes);
app.use('/', foodRoutes)


const start = async () => {
  await createTables();
  await generateData();

  await connectToMongo();
  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
};

start();