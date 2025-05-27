/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");
const { Resend } = require("resend");

// Use your real Resend API key here
const resend = new Resend("re_Qrr2KVTQ_47mVpSpyyoSxgXe5Kg6PLteX");

exports.sendEmailOnEventEnd = functions.firestore
  .document("events/{eventId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    if (!before.ended && after.ended) {
      const email = after.userEmail;

      try {
        await resend.emails.send({
          from: "noreply.clock101@gmail.com", // must match verified sender in Resend
          to: email,
          subject: "Your event has ended",
          text: `Hi! Your event "${after.eventName || "Clock 101 Event"}" has ended.`,
        });
        console.log(`Email sent to ${email}`);
      } catch (error) {
        console.error("Failed to send email:", error);
      }
    }

    return null;
  });
