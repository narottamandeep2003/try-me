
import HomeCategories from "@/components/HomeCategories";
import LandingPage from "@/components/LandingPage";
import Product from "@/components/Product";
import { HomeCategoriesType } from "@/types/HomePage";


export default function Home() {
  
  
  const AudienceCategories: HomeCategoriesType = {
    title: "AudienceCategories",
    categories: [
      { id: 1, title: "Kids", imageUrl: "/images/Kids.jpg" },
      { id: 2, title: "Man", imageUrl: "/images/Man.jpg" },
      { id: 3, title: "Woman", imageUrl: "/images/Woman.jpg" },
      { id: 4, title: "Unisex", imageUrl: "/images/Unisex.jpg" },
    ],
  };
  const Categories: HomeCategoriesType = {
    title: "Categories",
    categories: [
      { id: 1, title: "T-shirt", imageUrl: "/images/T-shirt.jpg" },
      { id: 2, title: "Crop Top", imageUrl: "/images/CropTop.jpg" },
      { id: 3, title: "Jeans", imageUrl: "/images/Jeans.jpg" },
      { id: 4, title: "Jacket", imageUrl: "/images/Jacket.jpg" },
      { id: 5, title: "Dress", imageUrl: "/images/Dress.jpg" },
      { id: 6, title: "Skirt", imageUrl: "/images/Skirt.jpg" },
      { id: 7, title: "Sweater", imageUrl: "/images/Sweater.jpg" },
      { id: 8, title: "Shoes", imageUrl: "/images/shoes.jpg" },
    ],
  };
  
  
  return (
    <>
    <LandingPage></LandingPage>
    <HomeCategories data={AudienceCategories}></HomeCategories>
    <HomeCategories data={Categories}></HomeCategories>
    <Product></Product>
    <div className="my-5 w-full flex justify-center items-center text-sm"><span>Fits That Hit Different.</span></div>

    </>
  );
}
