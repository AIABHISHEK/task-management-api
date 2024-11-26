/**
 * Subtask Model
 * Represents subtasks linked to a parent task
 */
const mongoose = require('mongoose');

const SubtaskSchema = new mongoose.Schema({
    task_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
    status: { type: Number, enum: [0, 1], default: 0 }, // 0 = TODO, 1 = DONE
    is_deleted: { type: Boolean, default: false },
});

module.exports = mongoose.model('Subtask', SubtaskSchema);
