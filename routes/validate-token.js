// This could go in a separate middleware folder
// Middlewares are functions that have access to the request and the response object.
// middlewares are also functions that that execute before the route is executed.

const jwt = require('jsonwebtoken')

// middleware to validate token (rutas protegidas)
// The next parameter is a function that will be executed after the middleware is executed.
const verifyToken = (req, res, next) => {
    const token = req.header('auth-token')
    if (!token) return res.status(401).json({ error: 'Acceso denegado' })
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        next() // continuamos
    } catch (error) {
        res.status(400).json({error: 'token no es válido'})
    }
}

module.exports = verifyToken;