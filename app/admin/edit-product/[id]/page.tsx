'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAdminCheck } from '@/hook/useAdminCheck';
import { DB as db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, collection, getDocs, serverTimestamp } from 'firebase/firestore';
import { Product, ProductColor } from '@/types/product';
import Link from 'next/link';
import Image from 'next/image';

const audiences = ['Men', 'Women', 'Kids', 'Unisex'];

export default function EditProductPage() {
  const params = useParams();
  const productId = params?.id as string;

  const isAdmin = useAdminCheck();

  const [product, setProduct] = useState<Product | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Load categories
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

  // Load product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const docRef = doc(db, 'products', productId);
        const snapshot = await getDoc(docRef);

        if (snapshot.exists()) {
          const data = snapshot.data() as Product;
          setProduct(data);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Failed to fetch product', err);
      }
    };

    if (productId) fetchProduct();
  }, [productId]);

  const handleColorChange = (index: number, key: 'color' | 'stock', value: string) => {
    if (!product) return;

    const updated: ProductColor[] = product.colors.map((c, i) => {
      if (i !== index) return c;
      return {
        ...c,
        [key]: key === 'stock' ? Number(value) : value,
      };
    });

    setProduct({ ...product, colors: updated });
  };

  const handleAddColor = () => {
    if (!product) return;
    setProduct({
      ...product,
      colors: [...product.colors, { color: '', stock: 0 }]
    });
  };

  const handleSubmit = async () => {
    if (!product) return;

    if (
      !product.title ||
      !product.price ||
      !product.description ||
      !product.category ||
      !product.targetAudience
    ) {
      setError('Please fill in all fields.');
      return;
    }

    setUploading(true);
    try {
      let imageUrl = product.imageUrl;

      if (image) {
        const upload_preset = process.env.NEXT_PUBLIC_UPLOAD_PRESET!;
        const cloudName = process.env.NEXT_PUBLIC_CLOUD_NAME!;

        const formData = new FormData();
        formData.append('file', image);
        formData.append('upload_preset', upload_preset);

        const cloudRes = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: 'POST',
            body: formData
          }
        );

        const data = await cloudRes.json();
        if (!data.secure_url) throw new Error('Image upload failed');
        imageUrl = data.secure_url;
      }

      const docRef = doc(db, 'products', productId);
      await updateDoc(docRef, {
        ...product,
        price: Number(product.price),
        colors: product.colors.map(c => ({
          color: c.color,
          stock: Number(c.stock)
        })),
        imageUrl,
        updatedAt: serverTimestamp()
      });

      alert('Product updated successfully!');
    } catch (err) {
      console.error(err);
      setError('Failed to update product.');
    } finally {
      setUploading(false);
    }
  };

  if (isAdmin === null) return <div className="mt-20">Loading...</div>;
  if (!isAdmin)
    return (
      <div className="mt-20 text-center">
        <h1 className="text-xl font-bold">Access Denied</h1>
        <p>You do not have permission to access this page.</p>
      </div>
    );

  if (!product) return <div className="mt-20 text-center">Loading product...</div>;

  return (
    <div className="mt-20">
      <h1 className="text-2xl font-bold text-center mb-6">Admin - Edit Product</h1>
      <div className="text-center mb-4">
        <Link href="/" className="text-blue-500 underline mr-4">Home</Link>
        <Link href="/admin/create-category" className="text-blue-500 underline">Create Category</Link>
      </div>

      <div className="max-w-2xl mx-auto p-6 border rounded-xl shadow">
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {product.imageUrl && (
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-1">Current Image:</p>
            <Image
              src={product.imageUrl}
              alt="Product"
              width={200}
              height={200}
              className="w-40 h-40 object-cover rounded"
            />
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          onChange={e => e.target.files && setImage(e.target.files[0])}
          className="mb-4 block"
        />

        <input
          type="text"
          className="input mb-4 w-full"
          placeholder="Title"
          value={product.title}
          onChange={e => setProduct({ ...product, title: e.target.value })}
        />

        <input
          type="number"
          className="input mb-4 w-full"
          placeholder="Price"
          value={product.price}
          onChange={e => setProduct({ ...product, price: Number(e.target.value) })}
        />

        <textarea
          className="textarea mb-4 w-full"
          placeholder="Description"
          value={product.description}
          onChange={e => setProduct({ ...product, description: e.target.value })}
        />

        <select
          className="select mb-4 w-full"
          value={product.category}
          onChange={e => setProduct({ ...product, category: e.target.value })}
        >
          <option value="">Select Category</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          className="select mb-4 w-full"
          value={product.targetAudience}
          onChange={e => setProduct({ ...product, targetAudience: e.target.value })}
        >
          <option value="">Select Audience</option>
          {audiences.map(aud => (
            <option key={aud} value={aud}>{aud}</option>
          ))}
        </select>

        <div className="mb-4">
          <h2 className="font-semibold mb-2">Colors & Stock</h2>
          {product.colors.map((item, i) => (
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
          {uploading ? 'Updating...' : 'Update Product'}
        </button>
      </div>
    </div>
  );
}
