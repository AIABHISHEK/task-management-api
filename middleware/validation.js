/**
 * Validation Middleware
 * Captures validation errors and sends a formatted response
 */

const { validationResult } = require('express-validator');

exports.validate = (req, res, next) => {
    console.log('Validating request');
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Validation failed',
            errors: errors.array().map((err) => ({
                field: err.param,
                message: err.msg,
            })),
        });
    }
    next();
};
