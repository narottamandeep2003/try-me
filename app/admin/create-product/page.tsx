'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAdminCheck } from '@/hook/useAdminCheck';

import {
  collection,
  addDoc,
  getDocs,
  serverTimestamp
} from 'firebase/firestore';

import { DB as db } from '@/lib/firebase';

const audiences = ['Men', 'Women', 'Kids', 'Unisex'];

export default function SomeAdminPage() {
  const isAdmin = useAdminCheck();

  const [categories, setCategories] = useState<string[]>([]);

  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [audience, setAudience] = useState('');
  const [colors, setColors] = useState([{ color: '', stock: '' }]);
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // 🟡 Load categories from Firestore
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const titles = querySnapshot.docs.map(doc => doc.data().name);
        setCategories(titles);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };
    fetchCategories();
  }, []);

  const handleAddColor = () => {
    setColors([...colors, { color: '', stock: '' }]);
  };

  const handleColorChange = (index: number, key: 'color' | 'stock', value: string) => {
    const updated = [...colors];
    updated[index][key] = value;
    setColors(updated);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!title || !price || !description || !category || !audience || !image) {
      setError('Please fill in all fields.');
      return;
    }
  
    setUploading(true);
    try {
      const upload_preset=process.env.NEXT_PUBLIC_UPLOAD_PRESET!
      const formData = new FormData();
      formData.append('file', image);
      formData.append('upload_preset', upload_preset); 
      const cloudName = process.env.NEXT_PUBLIC_CLOUD_NAME; 
  
      const cloudRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );
  
      const data = await cloudRes.json();
      if (!data.secure_url) throw new Error('Image upload failed');
  
      const imageUrl = data.secure_url;
  
      // Upload product data to Firestore
      await addDoc(collection(db, 'products'), {
        title,
        price: Number(price),
        description,
        category,
        targetAudience: audience,
        colors: colors.map(c => ({
          color: c.color,
          stock: Number(c.stock)
        })),
        imageUrl,
        createdAt: serverTimestamp()
      });
  
      alert('Product created successfully!');
      setTitle('');
      setPrice('');
      setDescription('');
      setCategory('');
      setAudience('');
      setColors([{ color: '', stock: '' }]);
      setImage(null);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to upload product.');
    } finally {
      setUploading(false);
    }
  };
  

  // Loading state
  if (isAdmin === null) return <div className="mt-20">Loading...</div>;
  if (!isAdmin)
    return (
      <div className="mt-20 text-center">
        <h1 className="text-xl font-bold">Access Denied</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );

  return (
    <div className="mt-20">
      <h1 className="text-2xl font-bold text-center mb-6">Admin - Create Product</h1>
      <div className="text-center mb-4">
        <Link href="/" className="text-blue-500 underline mr-4">Home</Link>
        <Link href="/admin/create-category" className="text-blue-500 underline">Create Category</Link>
      </div>

      <div className="max-w-2xl mx-auto p-6 border rounded-xl shadow">
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="mb-4 block"
        />

        <input
          type="text"
          placeholder="Title"
          className="input mb-4 w-full"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <input
          type="number"
          placeholder="Price"
          className="input mb-4 w-full"
          value={price}
          onChange={e => setPrice(Number(e.target.value))}
        />

        <textarea
          placeholder="Description"
          className="textarea mb-4 w-full"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />

        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="select mb-4 w-full"
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={audience}
          onChange={e => setAudience(e.target.value)}
          className="select mb-4 w-full"
        >
          <option value="">Select Target Audience</option>
          {audiences.map(aud => (
            <option key={aud} value={aud}>{aud}</option>
          ))}
        </select>

        <div className="mb-4">
          <h2 className="font-semibold mb-2">Colors & Stock</h2>
          {colors.map((item, i) => (
            <div key={i} className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Color"
                className="input flex-1"
                value={item.color}
                onChange={e => handleColorChange(i, 'color', e.target.value)}
              />
              <input
                type="number"
                placeholder="Stock"
                className="input w-24"
                value={item.stock}
                onChange={e => handleColorChange(i, 'stock', e.target.value)}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddColor}
            className="text-blue-600 text-sm"
          >
            + Add another color
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          disabled={uploading}
        >
          {uploading ? 'Uploading...' : 'Create Product'}
        </button>
      </div>
    </div>
  );
}
