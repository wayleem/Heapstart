import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
	host: process.env.EMAIL_HOST,
	port: parseInt(process.env.EMAIL_PORT || "587"),
	secure: process.env.EMAIL_PORT === "465", // true for 465, false for other ports
	auth: {
		user: process.env.EMAIL_USER,
		pass: process.env.EMAIL_PASS,
	},
});

export const sendResetPasswordEmail = async (email: string, token: string): Promise<void> => {
	const resetUrl = `http://localhost:5173/password-reset/${token}`;

	const mailOptions = {
		from: `"Your App" <${process.env.EMAIL_FROM}>`,
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

export const sendOrderConfirmationEmail = async (to: string, order: any): Promise<void> => {
	const mailOptions = {
		from: `"Your App" <${process.env.EMAIL_FROM}>`,
		to: to,
		subject: "Order Confirmation",
		html: `
      <h1>Thank you for your order!</h1>
      <p>Your order #${order._id} has been confirmed.</p>
      <h2>Order Details:</h2>
      <ul>
        ${order.products
			.map(
				(item: any) => `
          <li>${item.product.name} - Quantity: ${item.quantity} - Price: $${item.price.toFixed(2)}</li>
        `,
			)
			.join("")}
      </ul>
      <p><strong>Total: $${order.orderTotal.toFixed(2)}</strong></p>
      <p>We'll notify you when your order has been shipped.</p>
    `,
	};

	try {
		const info = await transporter.sendMail(mailOptions);
		console.log("Order confirmation email sent: %s", info.messageId);
	} catch (error) {
		console.error("Error sending order confirmation email:", error);
		throw new Error("Failed to send order confirmation email");
	}
};
