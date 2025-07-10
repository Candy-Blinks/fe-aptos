import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  disable: false,
});

// Your Next config is automatically typed!
export default withPWA({
  // output: "export", // Comment out for dynamic apps with server-side features
  distDir: "./dist", // Changes the build output directory to `./dist/`.
  basePath: process.env.NEXT_PUBLIC_BASE_PATH, // Sets the base path to `/some-base-path`.
  images: {
    unoptimized: true, // Keep this if you want to disable image optimization
  },
  webpack: (config, { isServer }) => {
    // Suppress critical dependency warnings for known packages
    config.module = config.module || {};
    config.module.exprContextCritical = false;
    
    // Handle node modules that are not compatible with webpack bundling
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        url: false,
        zlib: false,
        http: false,
        https: false,
        assert: false,
        os: false,
        path: false,
        buffer: false,
        util: false,
      };
    }
    
    // Ignore specific warnings from dependencies
    config.ignoreWarnings = [
      /Critical dependency: the request of a dependency is an expression/,
      /Module not found: Can't resolve 'encoding'/,
      /Can't resolve 'keyv'/,
    ];
    
    // Add externals for server-side only packages
    if (!isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'got': 'got',
        'keyv': 'keyv',
        'cacheable-request': 'cacheable-request',
      });
    }
    
    return config;
  },
});
