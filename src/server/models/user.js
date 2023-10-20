const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    chatrooms: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chatroom'
    }]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
