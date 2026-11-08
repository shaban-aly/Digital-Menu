/** @type {import('next').NextConfig} */
const nextConfig = {
   allowedDevOrigins: ['192.168.1.5'],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
    ],
  },
};

export default nextConfig;
