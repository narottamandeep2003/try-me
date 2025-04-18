import Image from "next/image";

export default function Product() {
  const products = [
    {
      title: "Classic White T-Shirt",
      category: "Tops",
      price: 19.99,
      imageUrl:"/images/CropTop.jpg"
    },
    {
      title: "High-Waisted Denim Jeans",
      category: "Bottoms",
      price: 49.99,
      imageUrl:"/images/Jeans.jpg"
    },
    {
      title: "Oversized Hoodie",
      category: "Tops",
      price: 39.99,
      imageUrl:"/images/Jacket.jpg"
    },
    {
      title: "Black Slip Dress",
      category: "Dresses",
      price: 59.99,
      imageUrl:"/images/Dress.jpg"
    },
    {
      title: "Denim Jacket",
      category: "Outerwear",
      price: 69.99,
      imageUrl:"/images/Kids.jpg"
    },
    {
      title: "Chunky Sneakers",
      category: "Footwear",
      price: 89.99,
    imageUrl:"/images/shoes.jpg"
    },
    {
      title: "Beige Wide-Leg Trousers",
      category: "Bottoms",
      price: 44.99,
      imageUrl:"/images/Man.jpg"
    },
    {
      title: "Ribbed Crop Top",
      category: "Tops",
      price: 24.99,
      imageUrl:"/images/Skirt.jpg"
    },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      <span className="font-semibold mt-5 text-lg md:text-xl">Products</span>
      <div className="w-[calc(100%-150px)] max-md:w-[calc(100%-70px)] grid grid-cols-4 gap-16 max-md:grid-cols-2 max-md:gap-4 mt-5">
        {products.map((product, index) => (
          <div key={index} className="flex flex-col items-center">
            <Image
              width={500}
              height={500}
              className="w-full h-96 max-md:h-72 object-cover "
              alt={`${product.imageUrl} image`}
              src={product.imageUrl}
            />
            <span className="mt-2 w-full text-sm md:text-base leading-tight font-medium">
              {product.title}
            </span>
            <span className="w-full text-sm  md:text-base leading-tight">
              {product.category}
            </span>
            <span className="w-full text-sm md:text-base font-light  leading-tight">
              ${product.price.toFixed(2)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
