import Navbar from "@/components/navbar";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="mx-auto min-h-screen">
      <div className="mx-2 md:mx-4">
        <Navbar className="max-w-6xl px-3" />
        <div className="max-w-6xl mx-auto flex flex-col justify-center pt-12 px-3 ">
          {children}
        </div>
      </div>
    </section>
  );
}
