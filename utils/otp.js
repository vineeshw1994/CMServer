import nodemailer from "nodemailer";

const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendOtpEmail = async (email, subject, text, otp=0) => {
    console.log("ok");

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "testtdemoo11111@gmail.com",
            pass: "wikvaxsgqyebphvh",
        },
    });

    let mailOptions = {
        from: "rahithkr3@gmail.com",
        to: email,
        subject: `${subject}`,
        text: `${text}`,
    };
    console.log("mailOptions", mailOptions);

    await transporter.sendMail(mailOptions);
};

export { generateOtp, sendOtpEmail };
