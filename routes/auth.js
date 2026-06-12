const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// ============================================
// @route POST /api/auth/register
// @desc Register a new user (Admin only)
// ============================================
router.post('/register', async (req, res) => {
    try {
        const { username, password, grade, adminKey } = req.body;
        
        // Verify admin key
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
            grade,
            role: 'student'
        });
        
        res.status(201).json({ success: true, data: {
            id: user._id,
            username: user.username,
            grade: user.grade,
            role: user.role
        } });
        
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
});

// ============================================
// @route POST /api/auth/login
// @desc Login user
// ============================================
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        console.log('Login attempt for:', username);
        
        // Check if user exists
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found:', username);
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid username or password' 
            });
        }
        
        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log('Invalid password for:', username);
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid username or password' 
            });
        }
        
        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user._id, 
                username: user.username, 
                role: user.role || 'student' 
            },
            process.env.JWT_SECRET || 'your_secret_key',
            { expiresIn: '7d' }
        );
        
        console.log('Login successful for:', username);
        
        // Return user data (without password)
        res.json({
            success: true,
            token: token,
            user: {
                id: user._id,
                username: user.username,
                grade: user.grade,
                role: user.role || 'student'
            },
            message: 'Login successful'
        });
        
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Server error. Please try again.' 
        });
    }
});

// ============================================
// @route GET /api/auth/me
// @desc Get current user info
// ============================================
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json({ success: true, user: user });
    } catch (error) {
        console.error('Get me error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

module.exports = router;
