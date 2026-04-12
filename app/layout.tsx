import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Geist, Geist_Mono } from "next/font/google";

import Footer from "@/components/ui/Footer";
import SyncUser from "@/components/auth/SyncUser";
import RoleRedirect from "@/components/auth/RoleRedirect";
import { UserRoleProvider } from "@/contexts/UserRoleContext";
import { Toaster } from "react-hot-toast";
import "../styles/globals.css";
import "../styles/clerk.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Drive Safe Academy",
  description: "Hệ thống quản lý đào tạo lái xe thông minh",
  icons: {
    icon: "/brand-car.svg",
    shortcut: "/brand-car.svg",
    apple: "/brand-car.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider
      dynamic
      appearance={{
        variables: {
          colorPrimary: "#6b6545",
          colorBackground: "#f8f6ef",
          colorText: "#6b6545",
          colorInputBackground: "#7a7455",
          colorInputText: "#fff",
        },
        elements: {
          cardBox: "custom-clerk-cardBox",
          card: "custom-clerk-card",
          main: "custom-clerk-main",
          headerTitle: "custom-clerk-headerTitle",
          headerSubtitle: "custom-clerk-headerSubtitle",
          formFieldInput: "custom-clerk-input",
          formButtonPrimary: "custom-clerk-primaryBtn",
          dividerText: "custom-clerk-dividerText",
          dividerLine: "custom-clerk-dividerLine",
          footerActionLink: "custom-clerk-footerActionLink",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block"
          />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
          <UserRoleProvider>
            <SyncUser />
            <RoleRedirect />
            <Toaster position="top-right" reverseOrder={false} />
            <main className="flex-1">{children}</main>
            {/* <Footer /> */}
          </UserRoleProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
