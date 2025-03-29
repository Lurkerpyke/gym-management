import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        domains: ['lh3.googleusercontent.com', 'www.pexels.com', 'avatars.githubusercontent.com', 'unsplash.com', 'utfs.io'], // Adicionando múltiplos domínios
    },
    transpilePackages: ['pdfmake'],
};


export default nextConfig;
