/**
 * Task Model
 * Represents tasks created by users
 */
const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    due_date: { type: Date, required: true },
    priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
    status: { type: String, enum: ['TODO', 'DONE'], default: 'TODO' },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    is_deleted: { type: Boolean, default: false },
});

module.exports = mongoose.model('Task', TaskSchema);
