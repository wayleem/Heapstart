import nodemailer from "nodemailer";

export const sendResetPasswordEmail = async (email: string, token: string) => {
	let transporter = nodemailer.createTransport({
		host: process.env.MAILTRAP_HOST,
		port: parseInt(process.env.MAILTRAP_PORT, 10),
		auth: {
			user: process.env.MAILTRAP_USER,
			pass: process.env.MAILTRAP_PASS,
		},
	});

	let info = await transporter.sendMail({
		from: '"Your App" <noreply@wayleem.com>',
		to: email,
		subject: "Password Reset",
		text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
               Please click on the following link, or paste this into your browser to complete the process:\n\n
               http://localhost:5173/password-reset/${token}\n\n
               If you did not request this, please ignore this email and your password will remain unchanged.\n`,
	});

	console.log("Message sent: %s", info.messageId);
};
