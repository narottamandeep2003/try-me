"use client";

import { useEffect, useState } from "react";
import { DB as db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { Product } from "@/types/product";

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      const docRef = doc(db, "products", id as string);
      const snap = await getDoc(docRef);

      if (!snap.exists()) {
        notFound();
        return;
      }

      const data = snap.data();
      const prod: Product = {
        title: data.title,
        price: data.price,
        description: data.description,
        category: data.category,
        targetAudience: data.targetAudience,
        imageUrl: data.imageUrl,
        colors: data.colors,
        createdAt: data.createdAt?.toDate?.() || undefined,
        updatedAt: data.updatedAt?.toDate?.() || undefined,
      };

      setProduct(prod);
      setSelectedColor(data.colors?.[0]?.color || "");
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !selectedColor) return;

    const existing = JSON.parse(localStorage.getItem("cart") || "[]");
    const item = {
      id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
      color: selectedColor,
      quantity: 1,
    };

    const updatedCart = [...existing, item];
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    alert("Added to cart!");
  };

  if (loading || !product) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">{product.title}</h1>
      <div className="flex flex-col md:flex-row gap-8">
        <Image
          src={product.imageUrl}
          alt={product.title}
          width={600}
          height={600}
          className="w-full md:w-[45%] h-auto object-cover rounded-xl"
        />

        <div className="flex-1 flex flex-col gap-4">
          <p className="text-xl text-gray-900 font-semibold">${product.price.toFixed(2)}</p>
          <p className="text-gray-700">{product.description}</p>

          <div className="text-sm space-y-1 mt-2">
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Target Audience:</strong> {product.targetAudience}</p>
          </div>

          <div className="mt-4">
            <label className="block mb-1 font-medium">Select Color</label>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 text-sm"
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
            >
              {product.colors.map((c, index) => (
                <option key={index} value={c.color}>
                  {c.color} – Stock: {c.stock}
                </option>
              ))}
            </select>
          </div>

          <button
            className="mt-6 bg-black text-white px-6 py-3 rounded-lg text-sm hover:bg-gray-800 transition"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>

          {product.createdAt && (
            <p className="text-xs text-gray-500 mt-6">
              Created: {product.createdAt.toLocaleDateString()} • Updated:{" "}
              {product.updatedAt?.toLocaleDateString() || "N/A"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
