"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/ui/Footer";

/**
 * Renders the Footer only on the landing page ("/").
 */
export default function FooterWrapper() {
  const pathname = usePathname();

  // Show footer only on the root landing page
  if (pathname !== "/") return null;

  return <Footer />;
}
