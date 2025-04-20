"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { DB as db } from "@/lib/firebase";
import ProductCard from "./ProductCard"; 
import FilterBar from "./FilterBar";
import Pagination from "./Pagination";
import { useSearchParams, useRouter } from "next/navigation";
interface ProductColor {
    color: string;
    stock: number;
  }
  
interface Product {
    id:string,
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
  
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);

  const searchParams = useSearchParams();
  const router = useRouter();

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const targetAudience = searchParams.get("audience") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const perPage = 8;

  // Fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, "products"));
      const items = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          price: data.price,
          description: data.description,
          category: data.category,
          targetAudience: data.targetAudience,
          imageUrl: data.imageUrl,
          colors: data.colors,
          createdAt: data.createdAt?.toDate?.() || null,
          updatedAt: data.updatedAt?.toDate?.() || null,
        } as Product;
      });
      setProducts(items);
    };

    fetchProducts();
  }, []);

  // Fetch categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      const snapshot = await getDocs(collection(db, "categories"));
      const names = snapshot.docs.map((doc) => doc.data().name as string);
      setCategories(names);
    };

    fetchCategories();
  }, []);

  // Filter products based on query params
  useEffect(() => {
    const filtered = products.filter((p) => {
      return (
        p.title.toLowerCase().includes(search.toLowerCase()) &&
        (category ? p.category === category : true) &&
        (targetAudience ? p.targetAudience === targetAudience : true)
      );
    });

    setFiltered(filtered);
  }, [products, search, category, targetAudience]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const start = (page - 1) * perPage;
  const currentProducts = filtered.slice(start, start + perPage);

  // Update URL query parameters
  const updateParams = (params: Record<string, string>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    Object.entries(params).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    router.push(`?${newParams.toString()}`);
  };

  return (
    <div className="w-full px-4 md:px-10 py-6">
      <h1 className="text-xl font-semibold">All Products</h1>

      <FilterBar
        search={search}
        category={category}
        targetAudience={targetAudience}
        categories={categories}
        setSearch={(val) => updateParams({ search: val, page: "1" })}
        setCategory={(val) => updateParams({ category: val, page: "1" })}
        setTargetAudience={(val) => updateParams({ audience: val, page: "1" })}
      />

      <div className="grid grid-cols-4 max-md:grid-cols-2 gap-6 mt-6">
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        setPage={(page) => updateParams({ page: page.toString() })}
      />
    </div>
  );
}
