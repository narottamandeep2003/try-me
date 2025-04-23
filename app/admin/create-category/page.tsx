"use client";

import { useAdminCheck } from "@/hook/useAdminCheck";
import { useState } from "react";
import { DB as db } from "@/lib/firebase";
import { addDoc, collection, Timestamp } from "firebase/firestore";

export default function SomeAdminPage() {
  const isAdmin = useAdminCheck();
  const [name, setName] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !image) return alert("Name and image are required");

    try {
      setLoading(true);

      const upload_preset = process.env.NEXT_PUBLIC_UPLOAD_PRESET!;
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset", upload_preset);

      const cloudName = process.env.NEXT_PUBLIC_CLOUD_NAME;
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await res.json();
      const downloadURL = data.secure_url;

      await addDoc(collection(db, "categories"), {
        name,
        imageUrl: downloadURL,
        createdAt: Timestamp.now(),
      });

      setSuccess("Category added successfully!");
      setName("");
      setImage(null);
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (isAdmin === null) return <div className="mt-20 text-center text-white">Loading...</div>;

  if (!isAdmin) {
    return (
      <div className="mt-20 text-center text-white px-4">
        <h1 className="text-xl font-semibold text-red-500">Access Denied</h1>
        <p className="text-sm">You do not have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-black pt-20 px-4">
      <div className="max-w-md mx-auto p-6 rounded-2xl border border-gray-300 shadow-lg bg-white">
        <h1 className="text-2xl font-bold mb-6 text-center">Add New Category</h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 text-sm font-medium">Category Name</label>
            <input
              type="text"
              placeholder="e.g. Shirts, Shoes"
              className="w-full p-3 rounded-lg bg-gray-100 border border-gray-300 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImage(e.target.files?.[0] || null)}
              className="w-full p-2 bg-gray-100 border border-gray-300 rounded-lg file:text-white file:bg-gray-700 file:border-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white font-semibold py-2 rounded-lg hover:bg-gray-800 transition disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Add Category"}
          </button>

          {success && (
            <p className="text-green-500 text-center text-sm font-medium">{success}</p>
          )}
        </form>
      </div>
    </div>
  );
}
