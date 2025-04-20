"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  return (
    <section className="flex min-h-screen flex-col items-center pt-6 justify-center sm:pt-0 sm:px-0">
      <div className="w-full max-w-lg p-4 flex flex-col items-center">
        <div className="flex h-12 items-center space-x-6 text-sm justify-center">
          <h1 className="text-2xl">401</h1>
          <Separator className="bg-gray-500" orientation="vertical" />
          <p className="text-sm font-normal">
            You are not authorized for this action.
          </p>
        </div>
        <Button
          className="mt-6"
          onClick={() => {
            handleGoBack();
          }}
        >
          <ArrowLeft />
          Back
        </Button>
      </div>
    </section>
  );
}
