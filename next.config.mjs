/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Outputs a Single-Page Application (SPA).
  distDir: './dist',
  // ignored when using babel FYI
  compiler: {
    styledComponents: true,
  },
  images: {
    unoptimized: true
  },
  reactStrictMode: false,
  // netlify build timing out @ 60 so increased here
  // 3 minutes
  staticPageGenerationTimeout: 3 * 60,
  transpilePackages: ["@past3lle/web3-modal", "@past3lle/forge-web3", "@past3lle/wagmi-connectors"],
  experimental: {
    cpus: 1
  }
}
 
export default nextConfig
