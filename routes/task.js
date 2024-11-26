/**
 * Task Routes
 * Defines all endpoints for managing tasks
 */

const express = require('express');
const { body, query, param } = require('express-validator');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const taskController = require('../controller/taskController');
const { validate } = require('../middleware/validation');

// Middleware to protect all routes
router.use(authMiddleware);

// Create a new task
router.post('/create',
    [
        body('title').isString().trim().notEmpty().withMessage('Title is required'),
        body('description').isString().trim().notEmpty().withMessage('Description is required'),
        body('due_date').isISO8601().toDate().withMessage('Due date must be a valid ISO8601 date'),
        body('priority')
            .isIn(['Low', 'Medium', 'High'])
            .withMessage('Priority must be one of: low, medium, high'),
        validate,
    ]
    ,
    taskController.createTask);

// Get all tasks with filters and pagination
router.get('/get',
    [
        query('priority')
            .optional()
            .isIn(['low', 'medium', 'high'])
            .withMessage('Priority filter must be one of: low, medium, high'),
        query('status')
            .optional()
            .isIn(['TODO', 'DONE'])
            .withMessage('Status filter must be one of: TODO, DONE'),
        query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
        query('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer'),
        validate,
    ]
    , taskController.getTasks);

// Update a task
router.patch('/update/:id',
    [
        param('id').isMongoId().withMessage('Invalid task ID'),
        body('due_date').optional().isISO8601().toDate().withMessage('Due date must be a valid ISO8601 date'),
        body('status')
            .optional()
            .isIn(['TODO', 'DONE'])
            .withMessage('Status must be one of: TODO, DONE'),
        body('priority')
            .optional()
            .isIn(['low', 'medium', 'high'])
            .withMessage('Priority must be one of: low, medium, high'),
        validate,
    ]
    , taskController.updateTask);

// Delete a task (soft delete)
router.delete('/delete/:id',
    [
        param('id').isMongoId().withMessage('Invalid task ID'), validate,
    ]
    , taskController.deleteTask);

module.exports = router;
