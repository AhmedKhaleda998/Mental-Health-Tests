const User = require('../models/user');

exports.takeTest = async (req, res) => {
    try {
        const { category, score, questions } = req.body;
        if (!req.user._id) {
            return res.status(404).json({ error: 'User not found!' });
        }
        const user = await User.findById(req.user._id);
        user.tests.push({ category, score, questions });
        await user.save();
        res.json({ message: 'Test submitted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};

exports.getTests = async (req, res) => {
    try {
        if (!req.user._id) {
            return res.status(404).json({ error: 'User not found!' });
        }
        const user = await User.findById(req.user._id);
        res.json({ message: 'User tests', tests: user.tests });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};

exports.predict = async (req, res) => {
    try {
        const { text } = req.body;
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${process.env.MODEL_TOKEN}`);
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify({ text }),
            redirect: "follow"
        };
        const response = await fetch(process.env.MODEL_URL, requestOptions)
        const result = await response.json();
        res.json({ message: 'Prediction', result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error });
    }
};
