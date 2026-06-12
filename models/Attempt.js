const mongoose = require('mongoose');

const AttemptSchema = new mongoose.Schema({
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
    paperNumber: {
        type: Number,
        required: true
    },
    attemptCount: {
        type: Number,
        default: 0
    },
    lastAttemptAt: {
        type: Date
    },
    maxAttempts: {
        type: Number,
        default: 3
    }
});

// Compound unique index
AttemptSchema.index({ userId: 1, packageId: 1, paperNumber: 1 }, { unique: true });

module.exports = mongoose.model('Attempt', AttemptSchema);