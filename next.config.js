/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,

    middleware: [
        {
            handler: 'middleware.ts',
            config: {
                matcher: '/api/*',
            }
        }
    ]
    
}

module.exports = nextConfig
