require('dotenv').config(); // Ensure environment variables are loaded

const formData = require('form-data');
const Mailgun = require('mailgun.js');

const mailgun = new Mailgun(formData);

const mg = mailgun.client({
    username: 'api',
    key: '14b500d72074ea7750234e5bffeb6c3c-911539ec-e8c798fe',
});

exports.sendMail = async (req, res) => {
    const { toEmail, fromEmail, subject, message } = req.body;

    try {
        const response = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
            from: fromEmail,
            to: [toEmail],
            subject: subject,
            text: message,
        });
        console.log("Email sent successfully:", response);
        return response;
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
};