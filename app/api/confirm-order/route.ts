import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import admin from "firebase-admin";

// Firebase Admin Init
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

interface CartItem {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  color: string;
  quantity: number;
}

// Stripe Init
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-03-31.basil",
});

export async function GET(req: NextRequest) {
  const session_id = req.nextUrl.searchParams.get("session_id");

  if (!session_id) {
    return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
  }

  try {
    // Get the Checkout Session from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (session.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 402 });
    }

    const orderRef = db.collection("orders").doc(session.id);
    const existingDoc = await orderRef.get();

    if (existingDoc.exists) {
      // Order already exists — don't overwrite
      return NextResponse.json({
        message: "Order already exists",
        orderId: session.id,
      });
    }

    // Parse metadata
    const {
      userId,
      userEmail,
      userName,
      address,
      phone,
      cart: cartJson,
    } = session.metadata as {
      userId: string;
      userEmail: string;
      userName: string;
      address: string;
      phone: string;
      cart: string;
    };

    const cart = JSON.parse(cartJson);

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
      paymentMethod: "ONLINE",
      status: "pending",
      otp: Math.floor(100000 + Math.random() * 900000),
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      message: "Order confirmed and saved",
      orderId: session.id,
    });
  } catch (error) {
    console.error("Order confirmation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
