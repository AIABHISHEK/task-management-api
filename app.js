require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/task');
const subtaskRoutes = require('./routes/subtask');

const app = express();
app.use(express.json());

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/subtasks', subtaskRoutes);

const PORT = process.env.PORT || 5000;

app.use((err, req, res, next) => {
    console.error('Error:', err);

    // Custom error response
    const status = err.status || 500;
    const message = err.message || 'Internal Server Error';

    res.status(status).json({
        success: false,
        message,
    });
});

mongoose.connect(process.env.MONGODB_URI).then
(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch((err) => {
    console.log('Failed to connect to MongoDB', err);
});


