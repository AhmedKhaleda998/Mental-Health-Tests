const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
require('dotenv').config();

const User = require("../models/user");

exports.login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array()[0].msg });
        }
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found!' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { _id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRATION }
        );
        res.json({
            message: 'User logged in successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

exports.register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array()[0].msg });
        }
        const { firstName, lastName, email, password, phone, gender, ssn } = req.body;
        const user = await User.findOne({ email });
        if (user) {
            return res.status(409).json({ error: 'Email already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new User({
            name: {
                first: firstName.charAt(0).toUpperCase() + firstName.slice(1).toLowerCase(),
                last: lastName.charAt(0).toUpperCase() + lastName.slice(1).toLowerCase()
            },
            email,
            password: hashedPassword,
            phone,
            gender,
            ssn
        });
        await newUser.save();
        res.json({ message: 'User registered successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

exports.logout = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET, { expiresIn: '1ms' });
        res.json({ message: 'User logged out successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};