const Activity = require('../models/Activity');

const setupSocket = (io) => {
    // Track connected users
    const connectedUsers = new Map();

    io.on('connection', (socket) => {
        console.log('New client connected:', socket.id);

        // User authentication for socket
        socket.on('authenticate', (userId) => {
            connectedUsers.set(userId, socket.id);
            console.log(`User ${userId} authenticated on socket`);
        });

        // Join room for specific user notifications
        socket.on('join', (userId) => {
            socket.join(`user_${userId}`);
            console.log(`User ${userId} joined their room`);
        });

        // Join admin room
        socket.on('joinAdmin', () => {
            socket.join('admin_room');
            console.log('Admin joined admin room');
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            for (let [userId, socketId] of connectedUsers.entries()) {
                if (socketId === socket.id) {
                    connectedUsers.delete(userId);
                    break;
                }
            }
            console.log('Client disconnected:', socket.id);
        });
    });

    // Helper function to send notification to specific user
    const notifyUser = (userId, event, data) => {
        io.to(`user_${userId}`).emit(event, data);
    };

    // Helper function to notify all admins
    const notifyAdmins = (event, data) => {
        io.to('admin_room').emit(event, data);
    };

    // Helper function to broadcast payment updates
    const broadcastPaymentUpdate = async (payment, status) => {
        // Notify the user who made the payment
        notifyUser(payment.userId.toString(), 'payment_status_update', {
            paymentId: payment._id,
            status: status,
            packageId: payment.packageId,
            message: status === 'approved' 
                ? 'Your payment has been approved! You can now access the package.'
                : status === 'rejected'
                ? 'Your payment was rejected. Please contact admin.'
                : 'Your payment is pending review.'
        });

        // Notify admins
        notifyAdmins('new_payment_activity', {
            type: 'payment_update',
            userId: payment.userId,
            status: status,
            timestamp: new Date()
        });

        // Log activity
        await Activity.create({
            username: payment.userId.toString(),
            type: 'payment',
            details: `Payment status changed to ${status}`
        });
    };

    // Helper function for real-time quiz progress
    const broadcastQuizProgress = (userId, paperNumber, progress) => {
        notifyUser(userId, 'quiz_progress', {
            paperNumber,
            progress,
            timestamp: new Date()
        });
    };

    return { notifyUser, notifyAdmins, broadcastPaymentUpdate, broadcastQuizProgress };
};

module.exports = setupSocket;