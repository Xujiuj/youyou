/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ["gsap", "three", "react"],
  },
  images: {
    unoptimized: true, // 优化图片处理
  },
  // 为生产环境提供更好的性能优化
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      // 为浏览器端添加性能优化
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false, // 禁用fs模块（仅在服务器端可用）
      };
    }
    
    // 优化three.js相关库
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          three: {
            test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
            name: 'three',
            chunks: 'all',
            priority: 10,
          },
          gsap: {
            test: /[\\/]node_modules[\\/](gsap)[\\/]/,
            name: 'gsap',
            chunks: 'all',
            priority: 10,
          },
        },
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;