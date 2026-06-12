const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    transactionRef: {
        type: String,
        required: true,
        trim: true
    },
    paymentDate: {
        type: Date,
        required: true
    },
    slipData: {
        type: String, // Base64 or Cloudinary URL
        required: true
    },
    slipMimeType: {
        type: String,
        default: 'image/png'
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    approvedBy: {
        type: String,
        default: null
    },
    approvedAt: {
        type: Date
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    notes: {
        type: String,
        default: ''
    }
});

module.exports = mongoose.model('Payment', PaymentSchema);