/** @type {import('next').NextConfig} */
const nextConfig = {
    // Allow external images if you add avatar upload later
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "**",
            },
        ],
    },
    // Ensure strict mode is on for better debugging
    reactStrictMode: true,
    // Suppress specific warnings if necessary (optional)
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
};

export default nextConfig;