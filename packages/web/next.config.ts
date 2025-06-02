import type { NextConfig } from "next";
import { fileURLToPath } from "node:url";
import { createJiti } from "jiti";

// Importing env here to validate during build
const jiti = createJiti(fileURLToPath(import.meta.url));
try {
  jiti.esmResolve("./src/env");
  console.log("✅ Env validated during build");
} catch (error) {
  console.error("❌ Env validation failed during build", error);
}

const nextConfig: NextConfig = {
  productionBrowserSourceMaps: true,
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/appendix-weighting",
        destination: "/weighting",
        permanent: true,
      },
      {
        source: "/weighting-history",
        destination: "/weighting/history",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
