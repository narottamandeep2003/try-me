'use client';
import { useEffect, useState } from "react";
import { useAdminCheck } from "@/hook/useAdminCheck";
import Link from "next/link";
import { collection, getDocs, query } from "firebase/firestore";
import { DB as db } from "@/lib/firebase";
import { useRouter } from "next/navigation";

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

const statusColor = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function SomeAdminPage() {
  const isAdmin = useAdminCheck();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isAdmin) {
      const fetchOrders = async () => {
        try {
          const ordersQuery = query(collection(db, "orders"));
          const querySnapshot = await getDocs(ordersQuery);
          const fetchedOrders: Order[] = [];
          querySnapshot.forEach((doc) => {
            fetchedOrders.push({ id: doc.id, ...doc.data() } as Order);
          });
          setOrders(fetchedOrders);
          setFilteredOrders(fetchedOrders);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, [isAdmin]);

  useEffect(() => {
    if (statusFilter === "all") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter(order =>
        order.status.toLowerCase() === statusFilter.toLowerCase()
      );
      setFilteredOrders(filtered);
    }
  }, [statusFilter, orders]);

  if (isAdmin === null || loading) {
    return <div className="mt-20 text-center">Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="mt-20 text-center px-4">
        <h1 className="text-2xl font-semibold text-red-600">Access Denied</h1>
        <p className="text-sm text-gray-600">You do not have permission to access this page.</p>
        <Link href="/" className="text-blue-600 underline mt-2 inline-block">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="mt-20 max-w-6xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6">Admin Orders</h1>
      <Link href="/" className="text-blue-500 underline mb-4 inline-block">← Back to Home</Link>

      {/* Filter Dropdown */}
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <label className="font-medium">Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border px-3 py-2 rounded-md shadow-sm text-sm w-full sm:w-auto"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {filteredOrders.length === 0 ? (
        <p className="text-gray-500 text-center">No orders found for this status.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredOrders.map(order => (
            <div
              key={order.id}
              className="border p-4 rounded-xl shadow hover:shadow-md transition bg-white cursor-pointer"
              onClick={() => router.push(`/admin/order/${order.id}`)}
            >
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-sm font-semibold text-gray-800">
                  Order #{order.id.slice(0, 6).toUpperCase()}
                </h2>
                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium ${
                    statusColor[order.status.toLowerCase() as keyof typeof statusColor] || "bg-gray-200 text-gray-700"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600 break-words">
                <p><strong>Customer:</strong> {order.userName}</p>
                <p><strong>Email:</strong> {order.userEmail}</p>
                <p><strong>Payment:</strong> {order.paymentMethod}</p>
              </div>
              <p className="mt-2 text-base font-semibold text-gray-900">
                ₹{order.totalAmount}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
