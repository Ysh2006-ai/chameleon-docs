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
    // Production optimizations
    poweredByHeader: false,
    compress: true,
    // Security headers
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                ],
            },
        ];
    },
};

export default nextConfig;