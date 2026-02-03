const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  connectionTimeout: 10000, 
  greetingTimeout: 10000,
  socketTimeout: 10000,
  tls: {
    rejectUnauthorized: false,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Verify Error:", error);
  } else {
    console.log("SMTP Server is ready to send emails");
  }
});

const sendEmail = async (to, subject, content) => {
  try {
    const mailOptions = {
      from: `"Cafe-Mania" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html: content,
    };

    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

module.exports = sendEmail;
