// We will create a new route called /auth that will handle all the authentication logic.

const router = require('express').Router();

// Lets create a const to import the User model
const User = require('../models/User');

// We use .post to send a request to our server
router.post('/register', async (req, res) => {

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