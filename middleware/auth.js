const jwt = require('jsonwebtoken');
const SECRET = "super_secret_key_123";

module.exports = (roles = []) => {
    return (req, res, next) => {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];

        if (!token) return res.status(403).json({ error: "Access denied. No token provided." });

        try {
            const decoded = jwt.verify(token, SECRET);
            // Check Role-Based Access
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
            }
            req.user = decoded;
            next();
        } catch (err) {
            res.status(401).json({ error: "Invalid or expired token" });
        }
    };
};

