'use client';
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { DB as db } from "@/lib/firebase";
import { useAdminCheck } from "@/hook/useAdminCheck";
import Link from "next/link";
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
  createdAt?: Date;
}

const statusOptions = ["pending", "processing", "delivered", "cancelled"];

export default function OrderDetailPage() {
  const { id } = useParams();
  const isAdmin = useAdminCheck();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      const fetchOrder = async () => {
        try {
          const docRef = doc(db, "orders", id as string);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const orderData = { id: docSnap.id, ...docSnap.data() } as Order;
            setOrder(orderData);
            setStatus(orderData.status);
          }
        } catch (error) {
          console.error("Failed to fetch order:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchOrder();
    }
  }, [id, isAdmin]);

  const handleStatusChange = async () => {
    if (!order) return;
    setUpdating(true);
    try {
      const docRef = doc(db, "orders", order.id);
      await updateDoc(docRef, { status });
      alert("Order status updated!");
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  if (isAdmin === null || loading) return <div className="mt-20 text-center">Loading...</div>;

  if (!isAdmin) {
    return (
      <div className="mt-20 text-center px-4">
        <h1 className="text-xl font-semibold text-red-600">Access Denied</h1>
        <p className="text-sm">You do not have permission to view this page.</p>
        <Link href="/" className="text-blue-600 underline mt-2 inline-block">Go Home</Link>
      </div>
    );
  }

  if (!order) {
    return <div className="mt-20 text-center text-gray-600">Order not found.</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center sm:text-left">Order Details</h1>
      <Link href="/admin/dashboard" className="text-blue-600 underline mb-4 inline-block">← Back to Orders</Link>

      <div className="border p-4 sm:p-6 rounded-lg shadow bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 sm:gap-x-6">
          <p className="text-lg font-semibold break-all"><strong>Order ID:</strong> {order.id}</p>
          <p><strong>Customer:</strong> {order.userName}</p>
          <p><strong>Email:</strong> {order.userEmail}</p>
          <p><strong>Phone:</strong> {order.phone}</p>
          <p className="sm:col-span-2"><strong>Address:</strong> {order.address}</p>
          <p><strong>Total:</strong> ₹{order.totalAmount}</p>
          <p><strong>Payment:</strong> {order.paymentMethod}</p>
        </div>

        {/* Status Update */}
        <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-2">
          <label className="font-medium">Status:</label>
          <select
            className="border rounded px-3 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <button
            onClick={handleStatusChange}
            disabled={updating}
            className="sm:ml-4 px-4 py-2 bg-black text-white rounded hover:bg-gray-900 disabled:opacity-50"
          >
            {updating ? "Updating..." : "Update Status"}
          </button>
        </div>
      </div>

      {/* Cart Items */}
      <h2 className="text-xl font-semibold mt-10 mb-4">Cart Items</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {order.cart.map((item) => (
          <div key={item.id} className="border p-4 rounded-lg shadow bg-gray-50">
            <Image
              src={item.imageUrl}
              alt={item.title}
              width={300}
              height={300}
              className="w-full h-52 object-cover rounded mb-3"
            />
            <h3 className="font-semibold text-lg">{item.title}</h3>
            <p className="text-sm text-gray-600">Color: {item.color}</p>
            <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
            <p className="text-sm font-medium mt-1">Price: ₹{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
