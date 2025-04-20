interface Props {
    currentPage: number;
    totalPages: number;
    setPage: (page: number) => void;
  }
  
  export default function Pagination({ currentPage, totalPages, setPage }: Props) {
    return (
      <div className="flex justify-center mt-6 space-x-2">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-4 py-2 rounded ${
              i + 1 === currentPage ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    );
  }
  