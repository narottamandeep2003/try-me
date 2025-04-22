// app/payment-failed/page.tsx
"use client";

import Link from "next/link";

export default function PaymentFailedPage() {
  return (
    <div className="p-6 max-w-xl mx-auto text-center mt-20">
      <h1 className="text-3xl font-bold text-red-600 mb-4">Payment Failed ❌</h1>
      <p className="text-lg mb-4">
        Something went wrong while processing your payment. Please try again or use another payment method.
      </p>
      <Link href="/checkout">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
          Return to Checkout
        </button>
      </Link>
    </div>
  );
}
