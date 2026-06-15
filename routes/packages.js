const express = require('express');
const router = express.Router();
const Package = require('../models/Package');
const { protect } = require('../middleware/auth');
const Attempt = require('../models/Attempt');
const Payment = require('../models/Payment');
const User = require('../models/User');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/packages
// @desc    Get all packages for current user
router.get('/', protect, async (req, res) => {
    try {
        // Get all packages for user's grade
        const packages = await Package.find({ 
            grade: req.user.grade,
            isActive: true 
        });

        // Get user's payments and assignments
        const payments = await Payment.find({ 
            userId: req.user._id,
            status: 'approved'
        });

        const attempts = await Attempt.find({ userId: req.user._id });

        // Enhance packages with user-specific data
        const enhancedPackages = packages.map(pkg => {
            const paid = payments.some(p => p.packageId.toString() === pkg._id.toString());
            const pendingPayment = payments.some(p => p.packageId.toString() === pkg._id.toString() && p.status === 'pending');
            const userAttempts = attempts.filter(a => a.packageId.toString() === pkg._id.toString());
            
            let totalAttempts = 0;
            let maxAttempts = 0;
            userAttempts.forEach(attempt => {
                totalAttempts += attempt.attemptCount;
                maxAttempts += attempt.maxAttempts;
            });

            return {
                _id: pkg._id,
                name: pkg.name,
                grade: pkg.grade,
                paperCount: pkg.paperCount,
                fee: pkg.fee,
                description: pkg.description,
                hasAccess: paid,
                isPending: pendingPayment === true,
                progress: {
                    attemptedPapers: userAttempts.length,
                    totalPapers: pkg.paperCount,
                    totalAttempts,
                    maxAttempts
                }
            };
        });

        res.json({ success: true, data: enhancedPackages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   GET /api/packages/:packageId/papers
// @desc    Get papers for a package
router.get('/:packageId/papers', protect, async (req, res) => {
    try {
        const packageId = req.params.packageId;
        
        // Check if user has access
        const payment = await Payment.findOne({ 
            userId: req.user._id, 
            packageId,
            status: 'approved'
        });

        if (!payment) {
            return res.status(403).json({ success: false, error: 'You do not have access to this package' });
        }

        const pkg = await Package.findById(packageId);
        if (!pkg) {
            return res.status(404).json({ success: false, error: 'Package not found' });
        }

        // Get user's attempts for this package
        const attempts = [];
        for (let i = 1; i <= pkg.paperCount; i++) {
            const attempt = await Attempt.findOne({ 
                userId: req.user._id, 
                packageId,
                paperNumber: i 
            });
            attempts.push({
                paperNumber: i,
                attemptsUsed: attempt ? attempt.attemptCount : 0,
                maxAttempts: 3,
                remaining: attempt ? 3 - attempt.attemptCount : 3,
                lastAttemptAt: attempt ? attempt.lastAttemptAt : null
            });
        }

        res.json({
            success: true,
            data: {
                package: pkg,
                papers: attempts
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Admin routes
// @route   POST /api/packages
// @desc    Create a new package (Admin only)
router.post('/', protect, adminOnly, async (req, res) => {
    try {
        const { name, grade, paperCount, fee, description } = req.body;
        
        const package = await Package.create({
            name,
            grade,
            paperCount,
            fee,
            description,
            createdBy: req.user.username
        });

        res.status(201).json({ success: true, data: package });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   DELETE /api/packages/:packageId
// @desc    Delete a package (Admin only)
router.delete('/:packageId', protect, adminOnly, async (req, res) => {
    try {
        await Package.findByIdAndDelete(req.params.packageId);
        res.json({ success: true, message: 'Package deleted' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
