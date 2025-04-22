import { NextRequest } from "next/server";
import admin from "firebase-admin";
import Stripe from "stripe";
import { NextResponse } from "next/server";

interface CartItem {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  color: string;
  quantity: number;
}
// Initialize Firebase Admin SDK
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
};

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}
const db = admin.firestore();

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-03-31.basil",
});

export async function POST(req: NextRequest) {
  const { cart, address, phone, paymentMethod, userId, userEmail, userName } =
    await req.json();

  if (!cart || !address || !phone || !userId || !userEmail || !userName) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    if (paymentMethod === "COD") {
      const orderRef = db.collection("orders").doc(); // Auto-generated ID

      await orderRef.set({
        userId,
        userEmail,
        userName,
        address,
        phone,
        cart,
        totalAmount: cart.reduce(
          (acc: number, item: CartItem) => acc + item.price * item.quantity,
          0
        ),
        paymentMethod: "COD",
        status: "preparing", // <-- standard starting status
        otp: Math.floor(100000 + Math.random() * 900000),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      return NextResponse.json({
        message: "Order placed successfully",
        orderId: orderRef.id,
      });
    }

    if (paymentMethod === "ONLINE") {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: cart.map((item: CartItem) => ({
          price_data: {
            currency: "inr",
            product_data: {
              name: item.title,
              images: [item.imageUrl],
            },
            unit_amount: item.price * 100,
          },
          quantity: item.quantity,
        })),
        mode: "payment",
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/order-confirmation?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/payment-failed`,
        metadata: {
          userId,
          userEmail,
          userName,
          address,
          phone,
          cart: JSON.stringify(cart),
        },
      });
      return NextResponse.json({ sessionId: session.id });
    }

    return NextResponse.json(
      { error: "Invalid payment method" },
      { status: 400 }
    );
  } catch (error) {
    console.error("Order error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
