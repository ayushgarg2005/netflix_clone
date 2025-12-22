import nodemailer from "nodemailer";

export const sendOtpEmail = async (email, otp) => {
  console.log(`Sending OTP email to ${email}`);

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    console.log("Transporter created");

    const info = await transporter.sendMail({
      from: `"Netflix Clone" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Your OTP Code",
      html: `
        <h2>OTP Verification</h2>
        <h1>${otp}</h1>
        <p>Valid for 5 minutes</p>
      `,
    });

    console.log("OTP email sent ✅", info.messageId);
  } catch (error) {
    console.error("❌ Email sending failed:");
    console.error(error); // THIS is the key
  }
};

