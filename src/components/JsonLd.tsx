import { SITE } from "@/lib/constants";

export function JsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE.name,
    description: SITE.description,
    url: SITE.url,
    email: SITE.email,
    telephone: SITE.phone,
    address: {
      "@type": "PostalAddress",
      streetAddress:
        "Office No. 302, 3rd Floor, Siddharth Elegance Complex, Old Chhani Road, Nizampura",
      addressLocality: "Vadodara",
      postalCode: "390002",
      addressRegion: "Gujarat",
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 22.34,
      longitude: 73.18,
    },
    priceRange: "₹₹",
    openingHours: "Mo-Sa 10:00-19:00",
    sameAs: [`https://wa.me/${SITE.whatsapp}`],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
