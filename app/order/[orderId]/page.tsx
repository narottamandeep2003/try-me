"use client";

import { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { DB as db } from "@/lib/firebase";
import { use } from "react"; // To unwrap params
import Image from "next/image";

interface CartItem {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  color: string;
  quantity: number;
}

interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  address: string;
  phone: string;
  cart: CartItem[];
  totalAmount: number;
  paymentMethod: "COD" | "ONLINE";
  status: string;
  otp: number;  // Added OTP field
  createdAt?: Date;
}

export default function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  // Use React.use() to unwrap the params Promise
  const { orderId } = use(params); // Unwrap the promise here

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (orderId) {
        const docRef = doc(db, "orders", orderId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setOrder(docSnap.data() as Order); // Store the order data
        } else {
          setError("Order not found.");
        }
      } else {
        setError("Invalid order ID.");
      }
      setLoading(false);
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) return <div>Loading order details...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6 max-w-2xl mx-auto mt-20">
      <h1 className="text-3xl font-bold mb-4">Order Details</h1>
      {order && (
        <>
          <p><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Total:</strong> ₹{order.totalAmount}</p>
          <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
          <p><strong>Shipping Address:</strong> {order.address}</p>
          <p><strong>Phone:</strong> {order.phone}</p>
          <p><strong>OTP:</strong> {order.otp}</p>  {/* Display OTP here */}

          <div className="mt-6">
            <h2 className="text-2xl font-semibold">Ordered Items</h2>
            <ul className="space-y-4">
              {order.cart.map((item) => (
                <li key={item.id} className="flex space-x-4">
                  <Image src={item.imageUrl} alt={item.title} className="w-20 h-20 object-cover" width={200} height={200} />
                  <div>
                    <p><strong>{item.title}</strong></p>
                    <p>Color: {item.color}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: ₹{item.price}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
