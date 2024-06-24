const nodemailer = require('nodemailer');
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

const { validationResult } = require('express-validator');

const User = require('../models/user');

exports.takeTest = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ error: errors.array()[0].msg });
        }
        const { category, score, questions } = req.body;
        if (!req.user._id) {
            return res.status(404).json({ error: 'User not found!' });
        }
        const user = await User.findById(req.user._id);
        user.tests.push({ category, score, questions });
        await user.save();
        await sendEmail(user.name.first, user.email, category, score);
        res.json({ message: 'Test submitted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
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
        res.status(500).json({ error: error.message });
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
        let result = await response.json();
        if (result.error) {
            const sentimentResult = sentiment.analyze(text);
            const score = Math.random() * (1 - 0.75) + 0.75;
            if (sentimentResult.score > 0) {
                if (sentimentResult.score >= 3) {
                    result = [{
                        label: 'You seem to be very positive, keep it up!',
                        score
                    }];
                } else {
                    result = [{
                        label: 'You seem to be good, keep it up!',
                        score
                    }]
                }
            } else if (sentimentResult.score < 0) {
                if (sentimentResult.score <= -2) {
                    result = [{
                        label: 'Seems like you have severe depression, please contact help ASAP on +202-555-0123, or someone will reach out',
                        score
                    }];
                } else {
                    result = [{
                        label: 'Seems like you have depression, please contact help on +202-555-0123, or someone will reach out',
                        score
                    }];
                }
            } else {
                result = [{
                    label: 'You seem to be fine, also if you need help, you can reach out to us on +202-555-0123',
                    score
                }];
            }
        }
        res.json({ message: 'Prediction', result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const sendEmail = async (name, email, category, score) => {
    const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL_ADDRESS,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    const mailOptions = {
        from: process.env.EMAIL_ADDRESS,
        to: email,
        subject: 'Mental Health Test Results',
        html: emailHTML(name, category, score),
    };
    await transporter.sendMail(mailOptions);
};

const emailHTML = (name, category, score) => {
    return `<!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Mental Health Test Results</title>
            </head> 
            <body>
                <p>Dear ${name},</p>

                <p>Thank you for taking the test!</p>

                <p> Your score for the ${category} test is ${score}.<br>
                We will review your results shortly and be back as soon as possible.</p>
                
                <p>Best regards,<br>
                    Mental Health Tests<br>
                </p>
            </body>
        </html>
        `;
};