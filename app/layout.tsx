import { siteUrl } from "@/lib/site-url";
import "@fontsource-variable/manrope/index.css";
import "@fontsource-variable/inter/index.css";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import "./globals.css";
import { defaultTitle, defaultDescription } from "@/lib/seo";

// The global 404 and staff login must never depend on CMS availability.
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: defaultTitle, template: "%s | Cypher Green Systems" },
  description: defaultDescription,
  keywords: [
    "Cypher Green Systems",
    "environmental technology company Kenya",
    "GIS and geospatial solutions Kenya",
    "software development Kenya",
    "environmental consulting",
    "digital transformation",
    "climate technology",
    "environmental data analytics",
  ],
  openGraph: {
    type: "website",
    siteName: "Cypher Green Systems",
    images: [{ url: "/brand/cgs-social.png", width: 1200, height: 630 }],
    title: "Cypher Green Systems — Technology. Environment. Opportunity.",
    description:
      "Engineering Technology. Advancing Sustainability. Creating Opportunity. A multidisciplinary technology and environmental solutions firm.",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true },
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Cypher Green Systems",
  alternateName: "CGS",
  slogan: "Technology. Environment. Opportunity.",
  description:
    "Multidisciplinary technology and environmental solutions firm: environmental science, GIS and geospatial intelligence, software engineering, data analytics, climate technology, research and digital innovation.",
  url: siteUrl,
  knowsAbout: [
    "Environmental assessment",
    "GIS and geospatial intelligence",
    "Software development",
    "Data science and analytics",
    "Climate and carbon technology",
    "Digital transformation",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{document.documentElement.dataset.theme=localStorage.getItem('cgs-theme')==='dark'?'dark':'light'}catch{}`,
          }}
        />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
        />
        {children}
        {process.env.VERCEL_ENV && <Analytics />}
      </body>
    </html>
  );
}
