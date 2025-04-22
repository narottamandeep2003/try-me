import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // Add Cloudinary to the allowed domains
  },
  reactStrictMode: true,
  env: {
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
    FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
  },
};

export default nextConfig;
