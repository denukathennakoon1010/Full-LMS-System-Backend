const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Package = require('../models/Package');
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');
const Payment = require('../models/Payment');
const Score = require('../models/Score');
const Activity = require('../models/Activity');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/admin/stats
// @desc    Get admin statistics
router.get('/stats', protect, adminOnly, async (req, res) => {
    try {
        const totalStudents = await User.countDocuments();
        const totalPackages = await Package.countDocuments();
        const totalPayments = await Payment.countDocuments();
        const pendingPayments = await Payment.countDocuments({ status: 'pending' });
        const totalScores = await Score.countDocuments();
        const totalAttempts = await Attempt.countDocuments();

        // Get recent activities
        const recentActivities = await Activity.find()
            .sort('-createdAt')
            .limit(20);

        // Get top students by score
        const topStudents = await Score.aggregate([
            { $group: { _id: '$userId', totalScore: { $sum: '$score' }, avgPercentage: { $avg: '$percentage' } } },
            { $sort: { avgPercentage: -1 } },
            { $limit: 10 },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' }
        ]);

        res.json({
            success: true,
            data: {
                stats: {
                    totalStudents,
                    totalPackages,
                    totalPayments,
                    pendingPayments,
                    totalScores,
                    totalAttempts
                },
                recentActivities,
                topStudents: topStudents.map(s => ({
                    username: s.user.username,
                    grade: s.user.grade,
                    avgPercentage: Math.round(s.avgPercentage),
                    totalScore: s.totalScore
                }))
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   GET /api/admin/users
// @desc    Get all users (Admin only)
router.get('/users', protect, adminOnly, async (req, res) => {
    try {
        const users = await User.find().select('-password').sort('-createdAt');
        res.json({ success: true, data: users });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   DELETE /api/admin/users/:userId
// @desc    Delete a user (Admin only)
router.delete('/users/:userId', protect, adminOnly, async (req, res) => {
    try {
        const userId = req.params.userId;
        
        // Delete all related data
        await Attempt.deleteMany({ userId });
        await Payment.deleteMany({ userId });
        await Score.deleteMany({ userId });
        await Activity.deleteMany({ userId });
        await User.findByIdAndDelete(userId);
        
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   PUT /api/admin/users/:userId/grade
// @desc    Change user grade (Admin only)
router.put('/users/:userId/grade', protect, adminOnly, async (req, res) => {
    try {
        const { grade } = req.body;
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { grade: parseInt(grade) },
            { new: true }
        ).select('-password');
        
        res.json({ success: true, data: user });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   PUT /api/admin/users/:userId/password
// @desc    Reset user password (Admin only)
router.put('/users/:userId/password', protect, adminOnly, async (req, res) => {
    try {
        const { newPassword } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        await User.findByIdAndUpdate(req.params.userId, { password: hashedPassword });
        
        res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   POST /api/admin/questions/bulk
// @desc    Bulk upload questions (Admin only)
router.post('/questions/bulk', protect, adminOnly, async (req, res) => {
    try {
        const { grade, packageId, paperNumber, questions } = req.body;
        
        // Delete existing questions for this paper
        await Question.deleteMany({ grade, packageId, paperNumber });
        
        // Insert new questions
        const questionDocs = questions.map((q, index) => ({
            grade,
            packageId,
            paperNumber: parseInt(paperNumber),
            questionNumber: index + 1,
            text: q.text,
            image: q.image || '',
            options: q.options.map(opt => ({ text: opt.text, image: opt.image || '' })),
            correctAnswer: q.correctAnswer
        }));
        
        await Question.insertMany(questionDocs);
        
        res.json({ success: true, message: `Uploaded ${questions.length} questions` });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   PUT /api/admin/attempts/reset-paper
// @desc    Reset paper attempts for a student (Admin only)
router.put('/attempts/reset-paper', protect, adminOnly, async (req, res) => {
    try {
        const { userId, packageId, paperNumber } = req.body;
        
        await Attempt.findOneAndDelete({ userId, packageId, paperNumber });
        
        res.json({ success: true, message: 'Paper attempts reset successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   PUT /api/admin/attempts/reset-package
// @desc    Reset all paper attempts for a package (Admin only)
router.put('/attempts/reset-package', protect, adminOnly, async (req, res) => {
    try {
        const { userId, packageId } = req.body;
        
        await Attempt.deleteMany({ userId, packageId });
        
        res.json({ success: true, message: 'Package attempts reset successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;