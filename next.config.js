/** @type {import('next').NextConfig} */
const nextConfig = {
    // Required for Docker: bundles a self-contained server into .next/standalone
    output: 'standalone',
    
    experimental: {
        serverActions: true,
    },

    webpack: (config) => {
        config.externals.push({
            'utf-8-validate': 'commonjs utf-8-validate',
            'bufferutil': 'commonjs bufferutil',
        })
        return config
    },
};

export default nextConfig;