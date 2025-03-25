import ModeToggle from "@/components/mode-toggle";
import React from "react";

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex min-h-screen flex-col items-center pt-6 sm:justify-center sm:pt-0 sm:px-0">
      <div className="w-full max-w-lg p-4">{children}</div>
      <div className="absolute bottom-5 right-6">
        <ModeToggle />
      </div>
    </section>
  );
}
