/**
 * User Model
 * Represents the users in the system
 */
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    password: { type: String, required: true }, // Encrypted password
});

module.exports = mongoose.model('User', UserSchema);
