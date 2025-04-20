import Link from "next/link";
import Image from "next/image";
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

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className="flex flex-col items-start p-4">
      <Image
        src={product.imageUrl}
        alt={product.title}
        width={500}
        height={500}
        className="w-full h-96 max-md:h-72 object-cover rounded-md"
      />
      <h3 className="mt-2 w-full text-sm md:text-base leading-tight font-medium">{product.title}</h3>
      <p className="w-full text-sm md:text-base leading-tight">{product.category}</p>
      <p className="w-full text-sm md:text-base font-light leading-tight">${product.price.toFixed(2)}</p>
    </Link>
  );
}
