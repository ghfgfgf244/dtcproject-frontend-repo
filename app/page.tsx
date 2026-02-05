"use client";

import { useState } from "react";

import Hero from "@/components/ui/Hero";
import Features from "@/components/ui/Features";
import Instructors from "@/components/ui/Instructors";
import Footer from "@/components/ui/Footer";
import AuthModal from "@/components/ui/AuthModal";

export default function Home() {
  const [openAuth, setOpenAuth] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");

  return (
    <>
      {/* <Header
        onLogin={() => {
          setAuthMode("login");
          setOpenAuth(true);
        }}
        onRegister={() => {
          setAuthMode("register");
          setOpenAuth(true);
        }}
      /> */}

      <Hero
        onRegister={() => {
          setAuthMode("register");
          setOpenAuth(true);
        }}
      />

      <Features />
      <Instructors />
      <Footer />

      {/* Popup Auth */}
      <AuthModal
        open={openAuth}
        mode={authMode}
        onClose={() => setOpenAuth(false)}
        onSwitch={setAuthMode}
      />
    </>
  );
}
