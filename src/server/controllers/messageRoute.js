const express = require('express');
const router = express.Router();
const Message = require('../models/message');

// CREATE a new message
router.post('/', async (req, res) => {
    try {
        const message = new Message(req.body);
        await message.save();
        res.status(201).send(message);
    } catch (error) {
        res.status(400).send(error);
    }
});

// READ all messages
router.get('/', async (req, res) => {
    try {
        const messages = await Message.find();
        res.send(messages);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;
