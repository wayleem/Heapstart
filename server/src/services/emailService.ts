import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: process.env.MAILTRAP_HOST,
	port: parseInt(process.env.MAILTRAP_PORT!, 10),
	auth: {
		user: process.env.MAILTRAP_USER,
		pass: process.env.MAILTRAP_PASS,
	},
});

export const sendResetPasswordEmail = async (email: string, token: string): Promise<void> => {
	const resetUrl = `http://localhost:5173/password-reset/${token}`;

	const mailOptions = {
		from: '"Your App" <noreply@wayleem.com>',
		to: email,
		subject: "Password Reset",
		text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
           Please click on the following link, or paste this into your browser to complete the process:\n\n
           ${resetUrl}\n\n
           If you did not request this, please ignore this email and your password will remain unchanged.\n`,
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("Message sent: %s", info.messageId);
	} catch (error) {
		console.error("Error sending email:", error);
		throw new Error("Failed to send reset password email");
	}
};
