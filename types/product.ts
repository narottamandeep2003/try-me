export interface ProductColor {
    color: string;
    stock: number;
  }
  
  export interface Product {
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
  