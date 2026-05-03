/** @type {import('next').NextConfig} */
import path from "path";

const rawDistDir = process.env.CAMPVOICE_NEXT_DIST_DIR;
const distDir = rawDistDir
  ? path.isAbsolute(rawDistDir)
    ? path.relative(process.cwd(), rawDistDir)
    : rawDistDir
  : ".next";

const nextConfig = {
  cleanDistDir: false,
  distDir,
  async rewrites() {
    const proxyTarget = process.env.CAMPVOICE_API_PROXY_TARGET || "http://127.0.0.1:8000";
    return [
      {
        source: "/api/v1/:path*",
        destination: `${proxyTarget}/api/v1/:path*`,
      },
    ];
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
