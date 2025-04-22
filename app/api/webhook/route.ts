// // app/api/webhook/route.ts

import { NextResponse } from "next/server";
import Stripe from "stripe";
import admin from "firebase-admin";
import { NextRequest } from "next/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-03-31.basil",
});

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

export const config = {
  api: {
    bodyParser: false, // Disable default body parser to read raw body
  },
};

export async function POST(req: NextRequest) {
  // Get the raw body of the request
  const buf = await req.text(); // Using .text() to read raw body directly as string

  const sig = req.headers.get("stripe-signature") as string;
  console.log("ji");
  let event: Stripe.Event;

  try {
    // Construct the event from raw body
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const metadata = session.metadata;

    if (metadata) {
      // Automatically process the order
      await db
        .collection("orders")
        .doc(session.id)
        .set({
          userId: metadata.userId,
          userEmail: metadata.userEmail,
          userName: metadata.userName,
          address: metadata.address,
          phone: metadata.phone,
          cart: JSON.parse(metadata.cart),
          totalAmount: session.amount_total! / 100, // Convert from cents to dollars
          paymentMethod: "ONLINE",
          status: "preparing", // This is the initial order status
          otp: Math.floor(100000 + Math.random() * 900000), // Generate OTP
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
    }
  }

  return NextResponse.json({ received: true });
}

// import { NextResponse } from 'next/server'
// import Stripe from 'stripe'

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
//   apiVersion: '2022-11-15',
// })

// export async function POST(request: Request) {
//   const body = await request.text()
//   const sig = request.headers.get('stripe-signature') as string

//   let event: Stripe.Event

//   try {
//     event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
//   } catch (err: any) {
//     console.error('Webhook Error:', err.message)
//     return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 })
//   }

//   if (event.type === 'checkout.session.completed') {
//     const session = event.data.object as Stripe.Checkout.Session
//     console.log('💰 Payment received!', session)
//     // Process the session, store in DB, etc.
//   }

//   return NextResponse.json({ received: true }, { status: 200 })
// }
