require("dotenv").config();
const nodemailer = require("nodemailer");

const isSmtpConfigured = () => {
    return Boolean(
        process.env.SMTP_HOST &&
        process.env.SMTP_USER &&
        process.env.SMTP_PASS
    );
};

const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
};

const sendOtpEmail = async ({ to, subject, otp, purpose }) => {
    const mailFrom = process.env.MAIL_FROM || process.env.SMTP_USER;
    const expireMinutes = process.env.OTP_EXPIRE_MINUTES || 10;
    const text = `Campus Shop - ${purpose}\nMã OTP: ${otp}\nHiệu lực: ${expireMinutes} phút.`;
    const html = `
        <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
            <h2 style="color:#059669">Campus Shop</h2>
            <p>Mã OTP của bạn cho <strong>${purpose}</strong>:</p>
            <p style="font-size:28px;font-weight:bold;letter-spacing:6px;color:#059669">${otp}</p>
            <p>Mã có hiệu lực trong <strong>${expireMinutes} phút</strong>. Không chia sẻ mã này với bất kỳ ai.</p>
        </div>
    `;

    if (!isSmtpConfigured()) {
        console.log(`[DEV EMAIL] To: ${to} | Subject: ${subject} | OTP: ${otp}`);
        return { success: true, devMode: true };
    }

    const transporter = createTransporter();
    await transporter.sendMail({
        from: mailFrom,
        to,
        subject,
        text,
        html
    });

    return { success: true, devMode: false };
};

module.exports = {
    sendOtpEmail,
    isSmtpConfigured
};
