"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { DB as db } from "@/lib/firebase";

interface CartItem {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  color: string;
  quantity: number;
}

interface Order {
  userId: string;
  userEmail: string;
  userName: string;
  address: string;
  phone: string;
  cart: CartItem[];
  totalAmount: number;
  paymentMethod: "COD" | "ONLINE";
  status: string;
  otp: number;
  createdAt?: Date;
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const orderId = searchParams.get("order_id"); // For COD orders
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const confirmAndFetchOrder = async () => {
      const id = sessionId || orderId;
      if (!id) {
        setError("Missing order/session ID.");
        setLoading(false);
        return;
      }

      try {
        if (sessionId) {
          const res = await fetch(`/api/confirm-order?session_id=${sessionId}`);
          const data = await res.json();

          if (!res.ok) {
            setError(data.error || "Failed to confirm Stripe order.");
            setLoading(false);
            return;
          }
        }

        const docRef = doc(db, "orders", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setOrder(docSnap.data() as Order); // cast Firestore data to Order
        } else {
          setError("Order not found.");
        }
      } catch (err) {
        console.error("Error confirming or fetching order:", err);
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    confirmAndFetchOrder();
  }, [sessionId, orderId]);

  if (loading) return <div className="p-6 mt-20">Loading your order...</div>;

  if (error) return <div className="p-6 text-red-500 mt-20">{error}</div>;

  if (!order) {
    return <div className="p-6 text-yellow-500 mt-20">Order details are unavailable.</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto mt-20">
      <h1 className="text-3xl font-bold mb-4 text-green-600">Order Confirmed 🎉</h1>
      <p className="mb-2">Thank you, {order.userName}!</p>
      <p className="mb-4">Your order has been placed successfully.</p>

      <div className="border p-4 rounded-md space-y-2 bg-gray-50">
        <p><strong>Order ID:</strong> {sessionId || orderId}</p>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Total:</strong> ₹{order.totalAmount}</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
        <p><strong>Shipping Address:</strong> {order.address}</p>
        <p><strong>OTP:</strong> {order.otp}</p>
      </div>
    </div>
  );
}
