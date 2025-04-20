// In "@/types/HomePage"
export interface HomeCategory {
  id: string; // Change from number to string to match Firestore document ID type
  title: string;
  imageUrl: string;
}

export interface HomeCategoriesType {
  title: string;
  categories: HomeCategory[];
}
