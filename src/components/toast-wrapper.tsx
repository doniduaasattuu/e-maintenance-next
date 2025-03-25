"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

export default function ToasterWrapper() {
  const { theme } = useTheme();
  return <Toaster theme={theme === "dark" ? "dark" : "light"} />;
}
