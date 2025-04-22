import Stripe from "stripe";

// Define a type for the cart items
interface CartItem {
  title: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-03-31.basil",
});

export const createCheckoutSession = async (cart: CartItem[], address: string, phone: string): Promise<string> => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: cart.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.title,
            images: [item.imageUrl],
          },
          unit_amount: item.price * 100, // Stripe expects the amount in cents
        },
        quantity: item.quantity,
      })),
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
      metadata: {
        address,
        phone,
      },
    });
    return session.id;
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      // Handle Stripe-specific errors
      console.error("Stripe Error:", error.message);
    } else {
      // Handle generic errors
      console.error("General Error:", error);
    }
    throw new Error(`Stripe session creation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};
