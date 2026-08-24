const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async (email, subject, text) => {
  try {
    const { data, error } = await resend.emails.send({
      from: "CinePhile <onboarding@resend.dev>",
      to: [email],
      subject: subject,
      text: text,
    });

    if (error) {
      console.error("Email sending failed:", error);
      throw new Error(error.message);
    }

    console.log("Email sent successfully:", data);

    return data;
  } catch (err) {
    console.error("Email Error:", err);
    throw err;
  }
};

// const nodemailer = require("nodemailer");

// module.exports = async (email, subject, text) => {
//   try {
//     const transporter = nodemailer.createTransport({
//       host: process.env.HOST,
//       service: process.env.SERVICE,
//       port: 587,
//       secure: false,
//       auth: {
//         user: process.env.USER,
//         pass: process.env.PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: process.env.USER,
//       to: email,
//       subject: subject,
//       text: text,
//     });

//     console.log("Email sent successfully");
//   } catch (err) {
//     console.log(err);
//   }
// };
