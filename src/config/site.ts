import { SiteConfig } from "@/types"

import { env } from "@/env.mjs"

export const siteConfig: SiteConfig = {
  name: "Prono CAN 2023",
  author: "Ghostscripter",
  description:
    "Application pour faire des pronostiques sur la CAN2023.",
  keywords: ["CAN", "AFCON", "Pronostic"],
  url: {
    base: env.NEXT_PUBLIC_APP_URL,
    author: "https://github.com/OLuai",
  },
  links: {
    github: "https://github.com/OLuai",
  },
  ogImage: `${env.NEXT_PUBLIC_APP_URL}/og.jpg`,
}
