const mongoose = require('mongoose');

const PackageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a package name'],
        trim: true
    },
    grade: {
        type: Number,
        required: true,
        enum: [10, 11]
    },
    paperCount: {
        type: Number,
        required: true,
        min: 1
    },
    fee: {
        type: Number,
        required: true,
        min: 0
    },
    description: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: String,
        default: 'admin'
    },
    isActive: {
        type: Boolean,
        default: true
    }
});

module.exports = mongoose.model('Package', PackageSchema);