const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { protect } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a new user (Admin only)
router.post('/register', async (req, res) => {
    try {
        const { username, password, grade, adminKey } = req.body;

        // Verify admin key (you can make this more secure)
        if (adminKey !== process.env.ADMIN_PASSWORD) {
            return res.status(403).json({ success: false, error: 'Admin access required' });
        }

        // Check if user exists
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ success: false, error: 'Username already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            username,
            password: hashedPassword,
            grade: parseInt(grade)
        });

        // Log activity
        await Activity.create({
            username: 'admin',
            type: 'admin_action',
            details: `Created account for ${username} (Grade ${grade})`
        });

        res.status(201).json({
            success: true,
            data: {
                id: user._id,
                username: user.username,
                grade: user.grade
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
router.post('/login', async (req, res) => {
    try {
        const { username, password, grade } = req.body;

        // Check for user
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Check grade
        if (user.grade !== parseInt(grade)) {
            return res.status(401).json({ success: false, error: `This account is for Grade ${user.grade}` });
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Update last login
        user.lastLogin = new Date();
        user.loginCount = (user.loginCount || 0) + 1;
        await user.save();

        // Create token
        const token = jwt.sign(
            { id: user._id, username: user.username, grade: user.grade },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        // Log activity
        await Activity.create({
            userId: user._id,
            username: user.username,
            type: 'login',
            details: `Logged into Grade ${grade}`,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                grade: user.grade,
                createdAt: user.createdAt,
                lastLogin: user.lastLogin,
                loginCount: user.loginCount
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   GET /api/auth/me
// @desc    Get current logged in user
router.get('/me', protect, async (req, res) => {
    res.json({
        success: true,
        data: req.user
    });
});

module.exports = router;