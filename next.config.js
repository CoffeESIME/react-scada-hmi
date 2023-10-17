/** @type {import('next').NextConfig} */
const nextConfig = {
    parserOptions: {
        project: './hmi-creator/tsconfig.json',  // Adjusted path
      },
      rules: {
        indent: ['error', 2],
      },
}

module.exports = nextConfig
