import Header from "@/components/ui/header";
import FooterWrapper from "@/components/ui/FooterWrapper";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER */}
      <Header />

      {/* PAGE CONTENT */}
      <main className="flex-1">{children}</main>

      {/* FOOTER - only on landing page (/) */}
      <FooterWrapper />
    </div>
  );
}