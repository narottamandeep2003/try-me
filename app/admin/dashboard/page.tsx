'use client';
import { useAdminCheck } from "@/hook/useAdminCheck";
import Link from "next/link";

export default function SomeAdminPage() {
  const isAdmin = useAdminCheck();

  if (isAdmin === null) {
    return <div className="mt-20 text-center text-lg">Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="mt-20 text-center px-4">
        <h1 className="text-xl font-semibold text-red-600">Access Denied</h1>
        <p className="text-sm">You do not have permission to access this page.</p>
        <Link href="/" className="text-blue-600 underline mt-2 inline-block">Go Home</Link>
      </div>
    );
  }

  return (
    <div className="mt-20 max-w-2xl mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Admin Dashboard</h1>
      <div className="grid grid-cols-1 gap-4">
        <Link
          href="/"
          className="block text-center px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-black transition"
        >
          Home
        </Link>
        <Link
          href="/admin/create-category"
          className="block text-center px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-black transition"
        >
          Create Category
        </Link>
        <Link
          href="/admin/create-product"
          className="block text-center px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-black transition"
        >
          Create Product
        </Link>
        <Link
          href="/admin/order-list"
          className="block text-center px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-black transition"
        >
          Order List
        </Link>
      </div>
    </div>
  );
}
