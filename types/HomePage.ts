export type HomeCategory = {
    id: number;
    title: string;
    imageUrl: string;
  };
  
export type HomeCategoriesType = {
    title: string;
    categories: HomeCategory[];
  };