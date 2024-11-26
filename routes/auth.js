const express = require('express');
const {body} = require('express-validator')
const { register, login } = require('../controller/authController');
const { validate } = require('../middleware/validation');
const router = express.Router();

/**
 * Auth Routes
 */
router.post('/register',
    [
        body('username').isString().trim().notEmpty().withMessage('Username is required'),
        body('password').isString().trim().notEmpty().withMessage('Password is required'),
        validate,
    ],
    register);
router.post('/login',
    [
        body('username').isString().trim().notEmpty().withMessage('Username is required'),
        body('password').isString().trim().notEmpty().withMessage('Password is required'),
        validate,
    ],
    login);

module.exports = router;
