const express = require('express');
const router = express.Router();
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');
const Score = require('../models/Score');
const Payment = require('../models/Payment');
const Package = require('../models/Package');
const { protect } = require('../middleware/auth');

// @route   GET /api/quiz/:packageId/:paperNumber/questions
// @desc    Get questions for a paper
router.get('/:packageId/:paperNumber/questions', protect, async (req, res) => {
    try {
        const { packageId, paperNumber } = req.params;

        // Check if user has access
        const payment = await Payment.findOne({ 
            userId: req.user._id, 
            packageId,
            status: 'approved'
        });

        if (!payment) {
            return res.status(403).json({ success: false, error: 'You do not have access to this package' });
        }

        // Check attempts
        let attempt = await Attempt.findOne({ 
            userId: req.user._id, 
            packageId, 
            paperNumber: parseInt(paperNumber) 
        });

        const attemptsUsed = attempt ? attempt.attemptCount : 0;
        if (attemptsUsed >= 3) {
            return res.status(403).json({ success: false, error: 'No attempts left for this paper' });
        }

        // Get questions
        const questions = await Question.find({ 
            packageId, 
            paperNumber: parseInt(paperNumber) 
        }).sort({ questionNumber: 1 });

        if (questions.length === 0) {
            return res.status(404).json({ success: false, error: 'No questions found for this paper' });
        }

        // Remove correct answers for client
        const clientQuestions = questions.map(q => ({
            _id: q._id,
            text: q.text,
            image: q.image,
            options: q.options,
            questionNumber: q.questionNumber
        }));

        res.json({ 
            success: true, 
            data: {
                questions: clientQuestions,
                attemptNumber: attemptsUsed + 1,
                totalQuestions: questions.length
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   POST /api/quiz/:packageId/:paperNumber/submit
// @desc    Submit quiz answers
router.post('/:packageId/:paperNumber/submit', protect, async (req, res) => {
    try {
        const { packageId, paperNumber } = req.params;
        const { answers, timeTaken } = req.body;

        // Check if user has access
        const payment = await Payment.findOne({ 
            userId: req.user._id, 
            packageId,
            status: 'approved'
        });

        if (!payment) {
            return res.status(403).json({ success: false, error: 'You do not have access to this package' });
        }

        // Check and update attempts
        let attempt = await Attempt.findOne({ 
            userId: req.user._id, 
            packageId, 
            paperNumber: parseInt(paperNumber) 
        });

        if (!attempt) {
            attempt = await Attempt.create({
                userId: req.user._id,
                packageId,
                paperNumber: parseInt(paperNumber),
                attemptCount: 1,
                lastAttemptAt: new Date()
            });
        } else if (attempt.attemptCount >= 3) {
            return res.status(403).json({ success: false, error: 'No attempts left' });
        } else {
            attempt.attemptCount += 1;
            attempt.lastAttemptAt = new Date();
            await attempt.save();
        }

        // Get questions to grade
        const questions = await Question.find({ 
            packageId, 
            paperNumber: parseInt(paperNumber) 
        });

        // Grade the quiz
        let correct = 0;
        const answerMap = new Map();

        for (const q of questions) {
            const userAnswer = answers[q._id.toString()];
            const isCorrect = userAnswer === q.correctAnswer;
            if (isCorrect) correct++;
            answerMap.set(q._id.toString(), {
                selected: userAnswer,
                correct: q.correctAnswer,
                isCorrect
            });
        }

        const percentage = Math.round((correct / questions.length) * 100);

        // Save score
        const score = await Score.create({
            userId: req.user._id,
            packageId,
            paperNumber: parseInt(paperNumber),
            attemptNumber: attempt.attemptCount,
            score: correct,
            totalQuestions: questions.length,
            percentage,
            timeTaken: timeTaken || 0,
            answers: answerMap
        });

        res.json({
            success: true,
            data: {
                score: correct,
                total: questions.length,
                percentage,
                attemptNumber: attempt.attemptCount,
                attemptsLeft: 3 - attempt.attemptCount
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// @route   GET /api/quiz/results
// @desc    Get user's quiz results
router.get('/results', protect, async (req, res) => {
    try {
        const scores = await Score.find({ userId: req.user._id })
            .populate('packageId', 'name')
            .sort('-completedAt');

        res.json({ success: true, data: scores });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;