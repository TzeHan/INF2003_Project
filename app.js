const express = require('express');
const app = express();
const path = require('path');
const PORT = 3000;

app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const indexRoutes = require('./routes/index');
const movieRoutes = require('./routes/movies');

app.use('/', indexRoutes);
app.use('/movies',movieRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
});