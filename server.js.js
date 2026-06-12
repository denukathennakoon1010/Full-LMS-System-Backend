const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
require('dotenv').config();

// Import database connection
const connectDB = require('./config/database');

// Import routes
const authRoutes = require('./routes/auth');
const packageRoutes = require('./routes/packages');
const quizRoutes = require('./routes/quiz');
const paymentRoutes = require('./routes/payments');
const adminRoutes = require('./routes/admin');

// Import socket setup
const setupSocket = require('./socket');

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: ['http://localhost:3000', 'https://your-frontend-domain.com'],
        methods: ['GET', 'POST'],
        credentials: true
    }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Make io accessible to routes
app.set('io', io);

// Setup socket handlers
const { notifyUser, notifyAdmins, broadcastPaymentUpdate, broadcastQuizProgress } = setupSocket(io);

// Make socket helpers available to routes
app.set('socketHelpers', { notifyUser, notifyAdmins, broadcastPaymentUpdate, broadcastQuizProgress });

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, '../frontend/index.html'));
    });
}

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ success: false, error: err.message || 'Something went wrong!' });
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);
    
    socket.on('authenticate', (userId) => {
        socket.join(`user_${userId}`);
        console.log(`User ${userId} authenticated`);
    });
    
    socket.on('joinAdmin', () => {
        socket.join('admin_room');
        console.log('Admin joined admin room');
    });
    
    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`✅ MongoDB: ${process.env.MONGODB_URI ? 'Configured' : 'Not configured'}`);
});