const mongoose = require('mongoose');

const OptionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    image: { type: String, default: '' }
});

const QuestionSchema = new mongoose.Schema({
    grade: {
        type: Number,
        required: true,
        enum: [10, 11]
    },
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Package',
        required: true
    },
    paperNumber: {
        type: Number,
        required: true,
        min: 1
    },
    questionNumber: {
        type: Number,
        required: true
    },
    text: {
        type: String,
        required: [true, 'Please add question text']
    },
    image: {
        type: String,
        default: ''
    },
    options: [OptionSchema],
    correctAnswer: {
        type: Number,
        required: true,
        min: 0,
        max: 3
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Compound index for unique question per paper
QuestionSchema.index({ grade: 1, packageId: 1, paperNumber: 1, questionNumber: 1 }, { unique: true });

module.exports = mongoose.model('Question', QuestionSchema);