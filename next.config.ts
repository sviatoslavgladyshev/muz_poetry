import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

/**
 * Empty for Cloudflare Pages / custom domain (muzpoetry.ru).
 * Set NEXT_PUBLIC_BASE_PATH=/muz_poetry only if you still need GitHub project Pages.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: basePath || undefined,
  assetPrefix: basePath || undefined,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(nextConfig);
