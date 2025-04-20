'use client'
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import HomeCategories from "@/components/HomeCategories";
import LandingPage from "@/components/LandingPage";
import Product from "@/components/Product";
import UserComp from "@/components/UserComp";
import { HomeCategoriesType } from "@/types/HomePage";
import { DB } from "@/lib/firebase"; // Make sure this is your Firebase config import
import HomeAudienceCategories from "@/components/HomeAudienceCategories";

export default function Home() {
  const [categories, setCategories] = useState<HomeCategoriesType | null>(null);

  // Fetch Categories from Firebase
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(DB, "categories"));
        const categoriesData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id, 
            title: data.name,
            imageUrl: data.imageUrl,
          };
        });

        setCategories({
          title: "Categories",
          categories: categoriesData,
        });
      } catch (error) {
        console.error("Error fetching categories: ", error);
      }
    };

    fetchCategories();
  }, []);

  if (!categories) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <UserComp />
      <LandingPage />
      <HomeAudienceCategories/>
      <HomeCategories data={categories} />
      <Product />
      <div className="my-5 w-full flex justify-center items-center text-sm">
        <span>Fits That Hit Different.</span>
      </div>
    </>
  );
}
