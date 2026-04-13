import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://my-cv-studio.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/maker",
        "/checker",
        "/s/",
        "/login",
        "/signup",
        "/forgot-password",
        "/otp",
        "/sso-callback",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
