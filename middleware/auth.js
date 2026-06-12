const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, error: 'Not authorized to access this route' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select('-password');
        next();
    } catch (err) {
        return res.status(401).json({ success: false, error: 'Not authorized' });
    }
};

const adminOnly = (req, res, next) => {
    // Admin check - you can have a separate admin collection or use a special username
    if (req.user.username === 'admin' || req.headers['admin-key'] === process.env.ADMIN_PASSWORD) {
        next();
    } else {
        res.status(403).json({ success: false, error: 'Admin access required' });
    }
};

module.exports = { protect, adminOnly };