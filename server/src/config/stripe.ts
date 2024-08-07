import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
	console.error("STRIPE_SECRET_KEY is not set in environment variables");
	process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default stripe;
