const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Configure your Outlook no-reply SMTP
const transporter = nodemailer.createTransport({
  service: 'Outlook365',
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: 'no-reply@yourdomain.com',  // your outlook no-reply email
    pass: 'your_app_password',        // use App Password or actual password if allowed
  },
});

exports.sendAlarmEmail = functions.https.onCall(async (data, context) => {
  const email = data.email;
  const subject = data.subject;
  const message = data.message;

  const mailOptions = {
    from: '"Clock 101" <no-reply@yourdomain.com>',
    to: email,
    subject: subject,
    text: message,
    html: `<p>${message}</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error: error.message };
  }
});
