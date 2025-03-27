import Navbar from "@/components/navbar";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto min-h-screen mb-6">
      <Navbar className="max-w-6xl px-3 md:px-6" />
      <div className="max-w-6xl mx-auto flex flex-col justify-center pt-12 px-3 md:px-6 ">
        {children}
      </div>
    </section>
  );
}
