interface FilterBarProps {
    search: string;
    category: string;
    targetAudience: string;
    categories: string[];
    setSearch: (val: string) => void;
    setCategory: (val: string) => void;
    setTargetAudience: (val: string) => void;
  }
  
  export default function FilterBar({
    search,
    category,
    targetAudience,
    categories,
    setSearch,
    setCategory,
    setTargetAudience,
  }: FilterBarProps) {
    return (
      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products"
          className="border px-4 py-2 rounded-md w-full md:w-1/4"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border px-4 py-2 rounded-md w-full md:w-1/4"
        >
          <option value="">All Categories</option>
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={targetAudience}
          onChange={(e) => setTargetAudience(e.target.value)}
          className="border px-4 py-2 rounded-md w-full md:w-1/4"
        >
          <option value="">All Audiences</option>
          <option value="Men">Men</option>
          <option value="Women">Women</option>
          <option value="Kids">Kids</option>
          <option value="Kids">Unisex</option>
        </select>
      </div>
    );
  }
  