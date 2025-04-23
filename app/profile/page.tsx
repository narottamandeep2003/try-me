"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { DB as db } from "@/lib/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import { auth } from "@/lib/firebase"; // import your Firebase auth instance

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
  createdAt?: Date;
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const ordersQuery = query(
          collection(db, "orders"),
          where("userId", "==", currentUser.uid)
        );
        const querySnapshot = await getDocs(ordersQuery);
        const fetchedOrders: Order[] = [];
        querySnapshot.forEach((doc) => {
          fetchedOrders.push({ id: doc.id, ...doc.data() } as Order);
        });
        setOrders(fetchedOrders);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) return <div>Loading...</div>;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-500 text-white";
      case "Shipped":
        return "bg-blue-500 text-white";
      case "Delivered":
        return "bg-green-500 text-white";
      case "Cancelled":
        return "bg-red-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  return (
    <div className="p-6 mt-20 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">
        Welcome, {user?.displayName || "User"}
      </h1>
      <h2 className="text-xl mb-6 text-center text-gray-800">Your Orders</h2>

      <div className="space-y-6">
        {orders.length > 0 ? (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-gray-300 rounded-lg shadow-lg p-6"
            >
              {/* Order ID and Status */}
              <div className="mb-4">
                <p className="text-lg font-semibold">Order ID:</p>
                <p className="text-gray-600">{order.id.slice(0, 10)}...</p> {/* Split Order ID */}
              </div>

              {/* Total and Payment Method */}
              <div className="flex flex-col mb-4">
                <p className="text-lg font-semibold">Total:</p>
                <p className="text-gray-600">₹{order.totalAmount}</p>

                <p className="text-lg font-semibold mt-2">Payment Method:</p>
                <p className="text-gray-600">{order.paymentMethod}</p>
              </div>

              {/* Order Status */}
              <div className="mb-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>

              {/* Button */}
              <button
                onClick={() => (window.location.href = `/order/${order.id}`)}
                className="w-full py-3 text-center text-white bg-black rounded-lg hover:bg-gray-800 mt-4"
              >
                View Order Details
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No orders found.</p>
        )}
      </div>
    </div>
  );
}
