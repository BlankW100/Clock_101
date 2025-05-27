/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "Outlook",
  auth: {
    user: "no_reply.clock101@outlook.com",
    pass: "fggiknxhblnefqax", // Replace with your Outlook app password
  },
});

exports.sendAlarmEmail = functions.https.onCall(async (data, context) => {
  const mailOptions = {
    from: "no_reply.clock101@outlook.com",
    to: data.email,
    subject: data.subject,
    text:
      data.message +
      "\n\nThis is an automated message from Clock 101. Please do not reply.",
  };

  try {
    await transporter.sendMail(mailOptions);
    return {success: true};
  } catch (error) {
    return {success: false, error: error.toString()};
  }
});
