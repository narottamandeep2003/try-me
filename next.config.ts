import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // Add Cloudinary to the allowed domains
  },
  api: {
    bodyParser: false, // Explicitly disable the default body parser
  },
};

export default nextConfig;
