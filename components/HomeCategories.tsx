import { HomeCategoriesType } from "@/types/HomePage";
import Image from "next/image";
import Link from "next/link"; 

export default function HomeCategories({ data }: { data: HomeCategoriesType }) {
  return (
    <div className="w-full flex flex-col items-center">
      <span className="font-semibold mt-5 text-lg md:text-xl">{data.title}</span>
      <div className="w-[calc(100%-150px)] max-md:w-[calc(100%-70px)] grid grid-cols-4 gap-16 max-md:grid-cols-2 max-md:gap-4 mt-5">
        {data.categories.map((label, index) => (
          <Link
            key={index}
            href={`/products?category=${label.title}&page=1`} 
            className="flex flex-col items-center"
          >
            <Image
              width={500}
              height={500}
              className="w-full h-96 max-md:h-72 object-cover"
              alt={`${label.title} Category image`}
              src={label.imageUrl}
              quality={60}
              priority={true}
            />
            <span className="mt-2 text-center text-sm md:text-base">{label.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
