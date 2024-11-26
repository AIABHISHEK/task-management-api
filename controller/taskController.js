/**
 * Task Controller
 * Handles CRUD operations for tasks
 */

const Task = require('../models/task');
const Subtask = require('../models/subtask');

/**
 * Create a new task
 */
exports.createTask = async (req, res) => {
    const { title, description, due_date, priority } = req.body;

    if (!title || !due_date) {
        return res.status(400).json({ message: 'Title and due date are required' });
    }

    try {
        const task = new Task({
            title,
            description,
            due_date,
            priority,
            user_id: req.user.id,
        });

        await task.save();
        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create task', error });
    }
};

/**
 * Get all tasks for a user with filters and pagination
 */
exports.getTasks = async (req, res) => {
    const { priority, status, due_date, page = 1, limit = 10 } = req.query;

    const query = { user_id: req.user.id, is_deleted: false };

    if (priority) query.priority = priority;
    if (status) query.status = status;
    if (due_date) query.due_date = { $lte: new Date(due_date) };

    try {
        const tasks = await Task.find(query)
            .sort({ due_date: 1 }) // Sort by due date (soonest first)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Task.countDocuments(query);

        res.status(200).json({
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            tasks,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch tasks', error });
    }
};

/**
 * Update a task
 * Allows changing due_date, status, and priority
 * Updates related subtasks if the task is marked as deleted
 */
exports.updateTask = async (req, res) => {
    const { id } = req.params;
    const { due_date, status, priority } = req.body;

    if (!due_date && !status && !priority) {
        return res.status(400).json({ message: 'No valid fields to update' });
    }

    try {
        const task = await Task.findOne({ _id: id, user_id: req.user.id, is_deleted: false });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        if (due_date) task.due_date = new Date(due_date);
        if (status) task.status = status;
        if (priority) task.priority = priority;

        await task.save();
        res.status(200).json({ message: 'Task updated successfully', task });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update task', error });
    }
};

/**
 * Delete a task (soft deletion)
 * Marks the task as deleted and also updates related subtasks
 */
exports.deleteTask = async (req, res) => {
    const { id } = req.params;

    try {
        const task = await Task.findOne({ _id: id, user_id: req.user.id, is_deleted: false });

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        task.is_deleted = true;
        await task.save();

        // Mark related subtasks as deleted
        await Subtask.updateMany({ task_id: id }, { $set: { is_deleted: true } });

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete task', error });
    }
};
