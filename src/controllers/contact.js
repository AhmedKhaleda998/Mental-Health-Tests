const { validationResult } = require('express-validator');

const Contact = require('../models/contact');

exports.sendMessage = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array()[0].msg });
        }
        const { name, email, message } = req.body;
        const newMessage = new Contact({ name, email, message });
        await newMessage.save();
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};