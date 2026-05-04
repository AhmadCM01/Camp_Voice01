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
    let proxyTarget = process.env.CAMPVOICE_API_PROXY_TARGET || "http://127.0.0.1:8000";
    if (!proxyTarget.startsWith("http://") && !proxyTarget.startsWith("https://")) {
      const looksLikeHost = /^(localhost|\d{1,3}(?:\.\d{1,3}){3}|[a-z0-9.-]+)(?::\d+)?$/i.test(proxyTarget);
      const hasDot = proxyTarget.includes(".");
      if (looksLikeHost && (hasDot || proxyTarget.toLowerCase() === "localhost")) {
        proxyTarget = `https://${proxyTarget}`;
      } else {
        throw new Error(
          "Invalid CAMPVOICE_API_PROXY_TARGET. Set it to a full URL like https://campvoice01-production.up.railway.app"
        );
      }
    }
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
