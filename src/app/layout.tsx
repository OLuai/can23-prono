/* eslint-disable react/no-unescaped-entities */

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

import { ScrollArea } from "@/registry/new-york/ui/scroll-area"
import { MobileLink } from "@/components/mobile-nav"
import React from "react"
import { docsConfig } from "@/config/docs"
import { Navigation } from "@/components/navigation"

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
    locale: "fr_FR",
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
          {
            isAuth ?
              (
                <div vaul-drawer-wrapper="" className="max-w-4xl mx-auto ">
                  <div className="relative flex min-h-screen flex-col bg-background">
                    <SiteHeader />
                    <main className="flex-1">
                      <div className="border-b">
                        <div className="px-2 md:px-8 w-full flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
                          <aside className="fixed top-14 z-30 pt-10 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
                            <div>
                              Profil de l'utilisateur
                            </div>
                            <ScrollArea className="h-full py-6 pr-6 lg:py-8">
                              <Navigation />
                            </ScrollArea>
                          </aside>
                          {children}
                        </div>
                      </div>
                    </main>
                    {/* <SiteFooter /> */}
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
