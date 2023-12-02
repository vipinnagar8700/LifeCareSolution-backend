const jwt = require('jsonwebtoken');

function generateRefreshToken(userId) {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
}

// const authenticateToken = (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (!token) {
//         return res.status(401).json({
//             message: 'Unauthorized. Token missing.'
//         });
//     }

//     jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//         if (err) {
//             return res.status(403).json({
//                 message: 'Unauthorized. Invalid token.'
//             });
//         }
//         req.user = user;
//         next();
//     });
// };

module.exports = { generateRefreshToken };
