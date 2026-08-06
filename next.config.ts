import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

/** GitHub project Pages live at `/<repo>`; set to "" for a custom domain root. */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "/muz_poetry";

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
