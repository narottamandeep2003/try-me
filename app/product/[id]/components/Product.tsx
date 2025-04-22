"use client";

import { useEffect, useState } from "react";
import { DB as db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import { Product } from "@/types/product";
import { useCart } from "@/app/context/CartContext"; // Import the useCart hook

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart} = useCart(); // Use the context here

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
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handleAddToCart = (color: string) => {
    if (!product || !color) return;

    addToCart({
      id: id as string,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
      color,
      quantity: 1,
    });

    alert(`Added ${color} to cart!`);
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

        <div className="flex-1 flex flex-col gap-4 mt-10">
          <p className="text-xl text-gray-900 font-semibold">${product.price.toFixed(2)}</p>
          <p className="text-gray-700">{product.description}</p>

          <div className="text-sm space-y-1 mt-2">
            <p><strong>Category:</strong> {product.category}</p>
            <p><strong>Target Audience:</strong> {product.targetAudience}</p>
          </div>

          <div className="mt-6 space-y-4">
            <p className="font-medium">Choose a color to add:</p>

            {product.colors.map((c, index) => (
              <div
                key={index}
                className="flex items-center justify-between border px-4 py-2 rounded-lg"
              >
                <span>
                  {c.color} – Stock: {c.stock}
                </span>
                <button
                  onClick={() => handleAddToCart(c.color)}
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 text-sm"
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>

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
