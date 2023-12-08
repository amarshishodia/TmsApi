const jwt = require('jsonwebtoken');
const secretKey = "HighwaySoluationsProvider"; // Replace with a strong, secret key



function GetToken(payload) {
    try {
        const expiresIns = new Date();
        expiresIns.setDate(expiresIns.getDate() + 1);
        //const token = jwt.sign(payload, secretKey, { expiresIn });
        const token = jwt.sign(payload, secretKey, { expiresIn: '1d' });
        let out = {
            token: token,
            expiresIn: expiresIns
        }
        return out;
    } catch (error) {
        console.error('JWT GetToken Failed:', err.message);
    }
}
const authenticateToken = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        if (!token) return res.status(401).json({ message: 'Unauthorized' });

        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' });

            // Attach user information to the request for further use in the route
            req.user = decoded;

            next();
        });
    } catch (error) {
        console.log(error);
    }
};
// jwt.verify(token, secretKey, (err, decoded) => {
//     if (err) {
//         console.error('JWT Verification Failed:', err.message);
//         // Handle invalid token
//     } else {
//         console.log('Decoded Token:', decoded);
//         // Token is valid, proceed with your logic
//     }
// });
module.exports = {
    GetToken,
    authenticateToken
};