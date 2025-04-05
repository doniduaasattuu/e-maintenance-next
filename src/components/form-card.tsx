import React from "react";
import { Card } from "./ui/card";

export default function FormCard({ children }: { children: React.ReactNode }) {
  return <Card className="py-8 px-5 sm:p-8 rounded-md">{children}</Card>;
}
