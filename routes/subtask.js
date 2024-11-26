/**
 * Subtask Routes
 * Defines all endpoints for managing subtasks
 */

const express = require('express');
const router = express.Router();
const { body, query, param } = require('express-validator');

const authMiddleware = require('../middleware/auth');
const subtaskController = require('../controller/subTaskController');
const { validate } = require('../middleware/validation');


// Middleware to protect all routes
router.use(authMiddleware);

// Create a new subtask
router.post('/create',
    [
        body('task_id').isMongoId().withMessage('Task ID must be a valid MongoDB ID'),
        body('title').isString().trim().notEmpty().withMessage('Title is required'),
        validate,
    ],
    subtaskController.createSubtask);

// Get all subtasks with filters and pagination
router.get('/get',
    [
        query('task_id').optional().isMongoId().withMessage('Task ID must be a valid MongoDB ID'),
        query('status')
            .optional()
            .isInt({ min: 0, max: 1 })
            .withMessage('Status filter must be either 0 (incomplete) or 1 (complete)'),
        query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
        query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
        validate,
    ],
    subtaskController.getSubtasks);

// Update a subtask's status
router.patch('/update/:id',
    [
        param('id').isMongoId().withMessage('Invalid subtask ID'),
        body('status')
            .isInt({ min: 0, max: 1 })
            .withMessage('Status must be either 0 (incomplete) or 1 (complete)'),
        validate,
    ],
    subtaskController.updateSubtask);

// Delete a subtask (soft delete)
router.delete('/delete/:id',
    [param('id').isMongoId().withMessage('Invalid subtask ID'), validate],
    subtaskController.deleteSubtask);

module.exports = router;
