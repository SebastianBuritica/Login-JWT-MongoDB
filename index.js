const express = require('express');
// We use mongoose to connect to our mongodb database
const mongoose = require('mongoose');
// We use body-parser to parse the body of our requests
const bodyparser = require('body-parser');

require('dotenv').config()

// With the app variable we can start our express server and use middleware like body-parser
const app = express();

// capturar body
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// Conexión a Base de datos
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.yphipax.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
// Lets create a const with the options that are there to avoid errors
const options = { useNewUrlParser: true, useUnifiedTopology: true }
mongoose.connect(uri, options)    

.then(() => console.log('Base de datos conectada'))
.catch(e => console.log('error db:', e))

// import routes
const authRoutes = require('./routes/auth');
const validateToken = require('./routes/validate-token');
const admin = require('./routes/admin');

// route middlewares, we will have to routes in auth, one for register and one for login
// A middleware is a function that has access to the request and the response object.
// In between '/api/user', & authRoutes, we will use our middleware (yet to be configured)
app.use('/api/user', authRoutes);
app.use('/api/admin', validateToken, admin);

// This middleware is just to test that our server loaded correctly, it will be commented out
// app.get('/', (req, res) => {
//     res.json({
//         estado: true,
//         mensaje: 'funciona!'
//     })
// });

// iniciar server
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server running at: ${PORT}`)
})