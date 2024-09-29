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
  // 10 minutes
  staticPageGenerationTimeout: 10 * 60,
  transpilePackages: ["@past3lle/web3-modal", "@past3lle/forge-web3", "@past3lle/wagmi-connectors"]
}
 
export default nextConfig
