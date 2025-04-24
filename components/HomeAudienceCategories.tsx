import Image from "next/image";
import Link from "next/link"; // Import Link component

export default function HomeAudienceCategories() {
  // Category data
  const audienceCategories = {
    title: "Audience Categories",
    categories: [
      { id: 1, title: "Kids", imageUrl: "/images/Kids.jpg" },
      { id: 2, title: "Men", imageUrl: "/images/Man.jpg" },
      { id: 3, title: "Women", imageUrl: "/images/Woman.jpg" },
      { id: 4, title: "Unisex", imageUrl: "/images/Unisex.jpg" },
    ],
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Title */}
      <span className="font-semibold mt-5 text-lg md:text-xl">{audienceCategories.title}</span>

      {/* Categories */}
      <div className="w-[calc(100%-150px)] max-md:w-[calc(100%-70px)] grid grid-cols-4 gap-16 max-md:grid-cols-2 max-md:gap-4 mt-5">
        {audienceCategories.categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?page=1&audience=${category.title}`} // Link to filtered products by audience
            className="flex flex-col items-center"
          >
            <Image
              width={500}
              height={500}
              className="w-full h-96 max-md:h-72 object-cover"
              alt={`${category.title} Category image`}
              src={category.imageUrl}
              quality={60}
              priority={true}
            />
            <span className="mt-2 text-center text-sm md:text-base">{category.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
