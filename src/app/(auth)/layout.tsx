import Navbar from "@/components/navbar";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto min-h-screen">
      <Navbar className="max-w-3xl" />
      <div className="max-w-3xl mx-auto flex flex-col justify-center pt-16 px-3 md:px-0">
        {children}
      </div>
    </section>
  );
}
