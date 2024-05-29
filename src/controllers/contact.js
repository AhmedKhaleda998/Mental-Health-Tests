const nodemailer = require('nodemailer');
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
        await sendEmail(name, email);
        res.status(201).json({ message: 'Message sent successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

const sendEmail = async (name, email) => {
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
        subject: 'Contact Message Confirmation',
        html: emailHTML(name),
    };
    await transporter.sendMail(mailOptions);
};

const emailHTML = (name) => {
    return `<!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <title>Contact Message Confirmation</title>
            </head> 
            <body>
                <p>Dear ${name},</p>
                
                <p>Thank you for reaching out!</p>

                <p> You are an invaluable part of everything we do here and we’re absolutely thrilled to hear from you.<br>
                We will review your message shortly and be back as soon as possible.</p>
                
                <p>Best regards,<br>
                    Mental Health Tests<br>
                </p>
            </body>
        </html>
        `;
};