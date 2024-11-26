/**
 * Subtask Controller
 * Handles CRUD operations for subtasks
 */

const Subtask = require('../models/subtask');
const Task = require('../models/task');

/**
 * Create a new subtask
 */
exports.createSubtask = async (req, res) => {
    console.log(req.body);
    const { task_id, title } = req.body;

    if (!task_id || !title) {
        return res.status(400).json({ message: 'Task ID and title are required' });
    }

    try {
        // Verify if the task exists and belongs to the user
        const task = await Task.findOne({ _id: task_id, user_id: req.user.id, is_deleted: false });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        const subtask = new Subtask({
            task_id,
            title,
            status: 0, // Default status: 0 (incomplete)
        });

        await subtask.save();
        res.status(201).json({ message: 'Subtask created successfully', subtask });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create subtask', error });
    }
};

/**
 * Get all subtasks for a user with filters
 */
exports.getSubtasks = async (req, res) => {
    const { task_id, status, page = 1, limit = 10 } = req.query;

    const query = { is_deleted: false };

    if (task_id) query.task_id = task_id;
    if (status) query.status = parseInt(status);

    try {
        const subtasks = await Subtask.find(query)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Subtask.countDocuments(query);

        res.status(200).json({
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            subtasks,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch subtasks', error });
    }
};

/**
 * Update a subtask's status
 */
exports.updateSubtask = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    console.log(req.body);
    if (status === undefined) {
        return res.status(400).json({ message: 'Invalid status value' });
    }

    try {
        const subtask = await Subtask.findOne({ _id: id, is_deleted: false });

        if (!subtask) {
            return res.status(404).json({ message: 'Subtask not found' });
        }

        subtask.status = status;
        await subtask.save();

        res.status(200).json({ message: 'Subtask status updated successfully', subtask });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update subtask', error });
    }
};

/**
 * Soft delete a subtask
 */
exports.deleteSubtask = async (req, res) => {
    const { id } = req.params;

    try {
        const subtask = await Subtask.findOne({ _id: id, is_deleted: false });

        if (!subtask) {
            return res.status(404).json({ message: 'Subtask not found' });
        }

        subtask.is_deleted = true;
        await subtask.save();

        res.status(200).json({ message: 'Subtask deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete subtask', error });
    }
};
