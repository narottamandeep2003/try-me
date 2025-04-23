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
  otp: number; // Added OTP field
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

  if (loading) return <div className="text-center text-gray-500">Loading order details...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto mt-20 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">Order Details</h1>

      {order && (
        <>
          {/* Order Summary */}
          <div className="space-y-4 mb-8">
            <div>
              <p className="font-semibold text-lg">Order ID:</p>
              <p className="text-gray-700">{order.id}</p>
            </div>
            <div>
              <p className="font-semibold text-lg">Status:</p>
              <p className="text-gray-700">{order.status}</p>
            </div>
            <div>
              <p className="font-semibold text-lg">Total:</p>
              <p className="text-gray-700">₹{order.totalAmount}</p>
            </div>
            <div>
              <p className="font-semibold text-lg">Payment Method:</p>
              <p className="text-gray-700">{order.paymentMethod}</p>
            </div>
            <div>
              <p className="font-semibold text-lg">Shipping Address:</p>
              <p className="text-gray-700">{order.address}</p>
            </div>
            <div>
              <p className="font-semibold text-lg">Phone:</p>
              <p className="text-gray-700">{order.phone}</p>
            </div>
            <div>
              <p className="font-semibold text-lg">OTP:</p>
              <p className=" bg-yellow-100 text-yellow-800 py-1 px-3 inline-block rounded-lg">
                {order.otp}
              </p>
            </div>
          </div>

          {/* Ordered Items */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Ordered Items</h2>
            <ul className="space-y-6">
              {order.cart.map((item) => (
                <li key={item.id} className="flex space-x-6 border-b py-4">
                  <Image
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded-md"
                    width={96}
                    height={96}
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{item.title}</p>
                    <p className="text-gray-600">Color: {item.color}</p>
                    <p className="text-gray-600">Quantity: {item.quantity}</p>
                    <p className="text-gray-600">Price: ₹{item.price}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Button to go back or perform other actions */}
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => window.history.back()}
              className="py-2 px-6 bg-black text-white rounded-lg hover:bg-gray-800"
            >
              Back to Orders
            </button>
          </div>
        </>
      )}
    </div>
  );
}
