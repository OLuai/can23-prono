import "@/styles/globals.css"

import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"

import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"

import { ThemeSwitcher } from "@/components/theme-switcher"
import { getCurrentUser } from "@/lib/session"

const inter = Inter({ subsets: ["latin"] })

interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url.base),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [
    {
      name: siteConfig.author,
      url: siteConfig.url.author,
    },
  ],
  creator: siteConfig.author,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url.base,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: "@_rdev7",
  },
  icons: {
    icon: "/favicon.ico",
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const session = await getCurrentUser();
  const isAuth = !!session;
  // if (session) {
  //   // console.log("session ::", session);
  // }
  // console.log("session ::", session);
  return (
    <html lang="fr" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          inter.className
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex-1">{children}</main>
          {
            isAuth ?
              (
                <div vaul-drawer-wrapper="">
                  <div className="relative flex min-h-screen flex-col bg-background">
                    <SiteHeader />
                    <main className="flex-1">{children}</main>
                    <SiteFooter />
                  </div>
                </div>
              )
              :
              (<main className="flex-1">{children}</main>)
          }

          <ThemeSwitcher />
        </ThemeProvider>
      </body>
    </html>
  )
}
