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

      // Upload to Cloudinary
      const upload_preset=process.env.NEXT_PUBLIC_UPLOAD_PRESET!
      const formData = new FormData();
      formData.append("file", image);
      formData.append("upload_preset",upload_preset); 

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
      console.log(downloadURL,data)
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

  if (isAdmin === null) return <div className="mt-20">Loading...</div>;

  if (!isAdmin) {
    return (
      <div className="mt-20">
        <h1>Access Denied</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  return (
    <div className="mt-20">
      <h1>Admin Page</h1>
      <div className="max-w-md mx-auto mt-10 p-6 border rounded-xl shadow bg-white">
        <h1 className="text-xl font-bold mb-4">Add New Category</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Category name"
            className="w-full p-2 border rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] || null)}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Add Category"}
          </button>
          {success && <p className="text-green-600">{success}</p>}
        </form>
      </div>
    </div>
  );
}
