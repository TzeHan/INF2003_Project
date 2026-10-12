const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const indexRoutes = require('./routes/index');
const movieRoutes = require('./routes/movie');

app.use('/', indexRoutes);
app.use('/movies',movieRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running at http://localhost:${PORT}`);
});