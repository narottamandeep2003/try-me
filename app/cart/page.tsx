"use client";

import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { cart, removeFromCart, clearCart } = useCart();
  const [isClient, setIsClient] = useState(false);

  // Ensure the component renders only on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;  // Avoid rendering on the server

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div>
          <ul>
            {cart.map((item) => (
              <li key={`${item.id}-${item.color}`} className="flex justify-between items-center py-4">
                <span>
                  {item.title} - {item.color} (Qty: {item.quantity})
                </span>
                <button
                  onClick={() => removeFromCart(item.id, item.color)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <button
              onClick={clearCart}
              className="bg-red-500 text-white py-2 px-6 rounded-lg"
            >
              Clear Cart
            </button>
            <span
            
              className="bg-black text-white py-2 px-6 rounded-lg ml-5"
            >
              <Link href={"/checkout"}>Checkout</Link>
              
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
