// We will create a new route called /auth that will handle all the authentication logic.

const router = require('express').Router();

// Lets create a const to import the User model
const User = require('../models/User');

// Lets create a Joi object to validate the data that we are going to send to the server
const Joi = require('@hapi/joi');

const schemaLogin = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(6).max(1024).required()
})

const schemaRegister = Joi.object({
    name: Joi.string().min(6).max(255).required(),
    email: Joi.string().min(6).max(1024).required().email(),
    password: Joi.string().min(6).max(100).required()
}) 

// Password hashing middleware to encrypt the password before saving it to the database (we will use bcrypt)
const bcrypt = require('bcrypt'); 

// JWT is a JSON Web Token (JWT) is a compact token format used for authentication and authorization.
// Whenever the user wants to go to a protected route, the server will send a JWT token to the user.
const jwt = require('jsonwebtoken');


router.post('/login', async (req, res) => {
    const { error } = schemaLogin.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Email o contraseña incorrectos');
    
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send('Email o contraseña incorrectos');

    // jwt.sign() is a method that creates a token with the data that we pass as a second argument.
    const token = jwt.sign({ 
        name: user.name,
        id: user._id
     }, process.env.TOKEN_SECRET);

    res.json({
        error: null,
        data: 'exito bienvenido',
        token: token
    })
})

// We use .post to send a request to our server
router.post('/register', async (req, res) => {

    // We use .validate to validate the data that we are going to send to the server
    const { error } = schemaRegister.validate(req.body)
    
    if (error) {
        return res.status(400).json(
            {error: error.details[0].message}
        )
    }

    // Validate email if it already exists
    const emailExists = await User.findOne({ email: req.body.email })
    // This will return true if the email exists and false if it doesn't
    if (emailExists) { 
        return res.status(400).json(
            {error: 'Email already exists'}
        )
    } 


    // Hash the password before saving it to the database
    const salt = await bcrypt.genSalt(10)
    const password = await bcrypt.hash(req.body.password, salt);


    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: password
    });

    try {
        // This const will 
        const savedUser = await user.save();
        res.json({
            error: null,
            data: savedUser
        })
    } catch (error) {
        // Status are the codes that are sent by the server to the client, for example: 404, 500, 200, etc.
        res.status(400).json({error})
    }

})

// We always export our router so that it can be used in index.js file
module.exports = router;