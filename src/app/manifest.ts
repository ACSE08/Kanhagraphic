import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: "Kanha",
    description: SITE.description,
    start_url: "/",
    display: "standalone",
    background_color: "#0a1628",
    theme_color: "#0a1628",
    orientation: "portrait-primary",
    categories: ["business", "printing"],
    lang: "en-IN",
    icons: [
      {
        src: "/icons/kg-logo.jpeg",
        sizes: "512x512",
        type: "image/jpeg",
        purpose: "any",
      },
    ],
  };
}
