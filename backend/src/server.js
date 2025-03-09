const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createServer } = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const config = require('./config/config');
const errorHandler = require('./middleware/error');

// Connect to database
connectDB();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: config.CORS_ORIGIN,
        methods: ['GET', 'POST']
    }
});

// Middleware
app.use(express.json());
app.use(cors({
    origin: config.CORS_ORIGIN,
    credentials: true
}));

// Dev logging middleware
if (config.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('join', (room) => {
        socket.join(room);
    });

    socket.on('leave', (room) => {
        socket.leave(room);
    });

    socket.on('message', (data) => {
        io.to(data.room).emit('message', data);
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Mount routes
app.use('/api/v1/auth', require('./routes/auth'));
// app.use('/api/v1/users', require('./routes/users'));
app.use('/api/v1/food-posts', require('./routes/foodPosts'));
app.use('/api/v1/blogs', require('./routes/blogs'));
app.use('/api/v1/reviews', require('./routes/reviews'));
app.use('/api/v1/chats', require('./routes/chats'));

// Error handling middleware
app.use(errorHandler);

const PORT = config.PORT;

httpServer.listen(PORT, () => {
    console.log(`Server running in ${config.NODE_ENV} mode on port ${PORT}`);
}); 