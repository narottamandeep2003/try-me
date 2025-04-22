"use client";

import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase"; 
import { onAuthStateChanged } from "firebase/auth"; // For listening to user auth state changes
import { loadStripe } from "@stripe/stripe-js";


export default function CheckoutPage() {
  const { cart } = useCart(); // Get cart state from CartContext
  const [paymentMethod, setPaymentMethod] = useState("COD"); // Default to COD
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // To handle client-side only logic
  const [address, setAddress] = useState(""); // Address input state
  const [phone, setPhone] = useState(""); // Phone number input state
  const [user, setUser] = useState<{
    uid:string,
    email:string,
    displayName: string
  }|null>(null); // To store the authenticated user details
  const router = useRouter();

  useEffect(() => {
    // This will run after the component mounts on the client
    setIsMounted(true);

    // Listen to user auth state
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          email: currentUser.email||"",
          displayName: currentUser.displayName || "Anonymous",
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); // Clean up the listener
  }, []);

  useEffect(() => {
    if (isMounted) {
      // Calculate the total amount only on the client side
      const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
      setTotalAmount(total);
    }
  }, [cart, isMounted]); // Recalculate when cart changes, but only after mount

  const handleCheckout = async () => {
    setLoading(true);

    if (!address || !phone) {
      alert("Please provide both address and phone number.");
      setLoading(false);
      return;
    }

    if (!user||user.email.length===0 ||user.displayName.length===0||user.uid.length===0 ) {
      alert("You must be logged in to place an order.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cart,
          address,
          phone,
          paymentMethod,
          userId: user.uid, // Firebase user ID
          userEmail: user.email, // Firebase user email
          userName: user.displayName, // Firebase user name (could be null if not set)
        }),
      });

      const data = await response.json();

      if (response.ok) {
        if (paymentMethod === "COD") {
          alert("Your order has been placed with Cash on Delivery.");
          router.push(`/order-confirmation?order_id=${data.orderId}`); // Navigate to order confirmation page
        } else if (paymentMethod === "ONLINE") {
          // Handle online payment (Stripe)
          const { sessionId } = data;
          const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK as string); // Load Stripe.js
          let error;
          if(stripe){
            error=await stripe.redirectToCheckout({ sessionId });
          } 
          if (error) {
            console.error(error);
            alert("Payment failed.");
          }
        }
      } else {
        alert(data.error || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("An error occurred. Please try again later.");
    }

    setLoading(false);
  };

  // Prevent rendering before the client-side hydration
  if (!isMounted) {
    return null; // Prevent rendering the content during SSR (hydration phase)
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Your Cart</h2>
        {cart.length === 0 ? (
          <p>Your cart is empty. Please add items to your cart first.</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center py-2 border-b">
                <span>{item.title} ({item.color}) - Qty: {item.quantity}</span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4">
          <p className="text-xl font-semibold">Total: ${totalAmount.toFixed(2)}</p>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Payment Method</h2>
        <div className="space-y-2">
          <div>
            <input
              type="radio"
              id="cod"
              name="payment-method"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={() => setPaymentMethod("COD")}
            />
            <label htmlFor="cod" className="ml-2">Cash on Delivery</label>
          </div>

          <div>
            <input
              type="radio"
              id="online"
              name="payment-method"
              value="ONLINE"
              checked={paymentMethod === "ONLINE"}
              onChange={() => setPaymentMethod("ONLINE")}
            />
            <label htmlFor="online" className="ml-2">Online Payment (via Stripe)</label>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h2 className="text-2xl font-semibold mb-4">Shipping Address</h2>
        <div>
          <label htmlFor="address" className="block">Address:</label>
          <input
            type="text"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-2 p-2 w-full border rounded"
            placeholder="Enter your shipping address"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="phone" className="block">Phone Number:</label>
          <input
            type="text"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-2 p-2 w-full border rounded"
            placeholder="Enter your phone number"
          />
        </div>
      </div>

      <div className="mt-6">
        <button
          onClick={handleCheckout}
          className="bg-blue-600 text-white py-2 px-6 rounded-lg w-full"
          disabled={loading || cart.length === 0}
        >
          {loading ? "Processing..." : "Confirm Order"}
        </button>
      </div>
    </div>
  );
}
