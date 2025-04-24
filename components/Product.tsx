"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { collection, getDocs, limit, query } from "firebase/firestore";
import { DB as db } from "@/lib/firebase";

interface ProductColor {
  color: string;
  stock: number;
}

interface Product {
  id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  targetAudience: string;
  imageUrl: string;
  colors: ProductColor[];
  createdAt?: Date;
  updatedAt?: Date;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, "products"), limit(8));
        const querySnapshot = await getDocs(q);

        const fetchedProducts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Product[];

        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="w-full flex flex-col items-center">
      <span className="font-semibold mt-5 text-lg md:text-xl">Products</span>
      <div className="w-[calc(100%-150px)] max-md:w-[calc(100%-70px)] grid grid-cols-4 gap-16 max-md:grid-cols-2 max-md:gap-4 mt-5">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="flex flex-col items-center p-2"
          >
            <Image
              width={500}
              height={500}
              className="w-full h-96 max-md:h-72 object-cover rounded-md"
              alt={`${product.title} image`}
              src={product.imageUrl}
              priority={true}
              quality={60}
            />
            <span className="mt-2 w-full text-sm md:text-base leading-tight font-medium">
              {product.title}
            </span>
            <span className="w-full text-sm md:text-base leading-tight">
              {product.category}
            </span>
            <span className="w-full text-sm md:text-base font-light leading-tight">
              ${product.price.toFixed(2)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
