const express = require('express');
const router = express.Router();
const Payment = require('../models/Payment');
const Package = require('../models/Package');
const User = require('../models/User');
const Activity = require('../models/Activity');
const { protect, adminOnly } = require('../middleware/auth');
const { upload } = require('../middleware/upload');

// Helper to convert buffer to base64
const bufferToBase64 = (buffer, mimeType) => {
    return `data:${mimeType};base64,${buffer.toString('base64')}`;
};

// @route   POST /api/payments/submit
// @desc    Submit a payment
router.post('/submit', protect, upload.single('slip'), async (req, res) => {
    try {
        const { packageId, transactionRef, paymentDate, amount, notes } = req.body;
        
        if (!req.file) {
            return res.status(400).json({ success: false, error: 'Bank slip is required' });
        }

        const pkg = await Package.findById(packageId);
        if (!pkg) {
            return res.status(404).json({ success: false, error: 'Package not found' });
        }

        // Check if already have approved payment
        const existingPayment = await Payment.findOne({
            userId: req.user._id,
            packageId,
            status: 'approved'
        });

        if (existingPayment) {
            return res.status(400).json({ success: false, error: 'You already have access to this package' });
        }

        // Convert file to base64
        const slipData = bufferToBase64(req.file.buffer, req.file.mimetype);

        const payment = await Payment.create({
            userId: req.user._id,
            packageId,
            amount: parseInt(amount) || pkg.fee,
            transactionRef,
            paymentDate: new Date(paymentDate),
            slipData,
            slipMimeType: req.file.mimetype,
            status: 'pending',
            submittedAt: new Date()
        });

        // Log activity
        await Activity.create({
            userId: req.user._id,
            username: req.user.username,
            type: 'payment',
            details: `Submitted payment for package: ${pkg.name} (LKR ${amount || pkg.fee})`
        });

        // Get io instance from app
        const io = req.app.get('io');
        if (io) {
            // Notify admins
            io.to('admin_room').emit('new_payment', {
                paymentId: payment._id,
                username: req.user.username,
                packageName: pkg.name,
                amount: amount || pkg.fee,
                timestamp: new Date()
            });
        }

        res.json({
            success: true,
            message: 'Payment submitted successfully. Awaiting admin approval.',
            data: { paymentId: payment._id }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   GET /api/payments/pending (Admin only)
// @desc    Get all pending payments
router.get('/pending', protect, adminOnly, async (req, res) => {
    try {
        const payments = await Payment.find({ status: 'pending' })
            .populate('userId', 'username grade')
            .populate('packageId', 'name fee')
            .sort('-submittedAt');

        res.json({ success: true, data: payments });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   PUT /api/payments/:paymentId/approve (Admin only)
// @desc    Approve a payment
router.put('/:paymentId/approve', protect, adminOnly, async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.paymentId)
            .populate('userId', 'username')
            .populate('packageId', 'name');

        if (!payment) {
            return res.status(404).json({ success: false, error: 'Payment not found' });
        }

        payment.status = 'approved';
        payment.approvedBy = req.user.username;
        payment.approvedAt = new Date();
        await payment.save();

        // Log activity
        await Activity.create({
            username: req.user.username,
            type: 'admin_action',
            details: `Approved payment for ${payment.userId.username} - Package: ${payment.packageId.name}`
        });

        // Get io instance
        const io = req.app.get('io');
        if (io) {
            // Notify the user
            io.to(`user_${payment.userId._id}`).emit('payment_approved', {
                packageId: payment.packageId._id,
                packageName: payment.packageId.name,
                message: 'Your payment has been approved! You can now access the package.'
            });
        }

        res.json({ success: true, message: 'Payment approved successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   PUT /api/payments/:paymentId/reject (Admin only)
// @desc    Reject a payment
router.put('/:paymentId/reject', protect, adminOnly, async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.paymentId)
            .populate('userId', 'username')
            .populate('packageId', 'name');

        if (!payment) {
            return res.status(404).json({ success: false, error: 'Payment not found' });
        }

        payment.status = 'rejected';
        payment.notes = req.body.notes || '';
        payment.approvedBy = req.user.username;
        payment.approvedAt = new Date();
        await payment.save();

        // Log activity
        await Activity.create({
            username: req.user.username,
            type: 'admin_action',
            details: `Rejected payment for ${payment.userId.username} - Package: ${payment.packageId.name}`
        });

        // Get io instance
        const io = req.app.get('io');
        if (io) {
            io.to(`user_${payment.userId._id}`).emit('payment_rejected', {
                packageId: payment.packageId._id,
                packageName: payment.packageId.name,
                message: 'Your payment was rejected. Please contact admin for more information.'
            });
        }

        res.json({ success: true, message: 'Payment rejected' });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   GET /api/payments/slip/:paymentId (Admin only)
// @desc    Get bank slip image
router.get('/slip/:paymentId', protect, adminOnly, async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.paymentId);
        if (!payment || !payment.slipData) {
            return res.status(404).json({ success: false, error: 'Slip not found' });
        }

        res.json({ success: true, data: { slipData: payment.slipData, mimeType: payment.slipMimeType } });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;