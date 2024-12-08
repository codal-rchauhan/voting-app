const jwt = require('jsonwebtoken');

const jwtAuthMiddleware = function(req, res, next) {

    let jwtSecretKey = process.env.JWT_SECRET_KEY;

    const authorization = req.header('Authorization');
    if (!authorization) return res.status(401).json({ message: 'authorization token not found' });

    try {
        const decoded = jwt.verify(token, jwtSecretKey);
        req.user = decoded;

        return next();
    } catch (error) {
        return res.status(401).json({message:'Invalid token'});
    }
}

const generateToken = function(userData) {
    const token = jwt.sign(userData, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION_TIME,
    });

    return token;
}

module.exports= {
    jwtAuthMiddleware,
    generateToken
}