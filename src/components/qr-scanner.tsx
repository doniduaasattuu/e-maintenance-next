"use client";

import React from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";
import z from "zod";
import { toast } from "sonner";
import { isEquipmentExist } from "@/actions/equipment-action";

export default function QRScanner() {
  const router = useRouter();

  React.useEffect(() => {
    // Initialize the scanner
    const html5QrCodeScanner = new Html5QrcodeScanner(
      "qr-reader",
      {
        fps: 10, // Frames per second for the scanner
        qrbox: { width: 300, height: 300 }, // QR scanning box dimensions
      },
      false
    );

    function onScanSuccess(decodedText: string) {
      //   router.push(route("equipments.show", decodedText.substr(0, 9)));
      const formatEquipment = z
        .string()
        .length(9, { message: "Code must be 9 characters" })
        .regex(/^[A-Z]{3}\d{6}$/, {
          message: "Format code is invalid. Example: EMO000123",
        });

      const result = formatEquipment.safeParse(decodedText);

      if (result.success) {
        const equipment: string = result.data;
        const response = isEquipmentExist(equipment);

        response.then((status) => {
          if (status.success) {
            router.push(`/equipments/${equipment}`);
            html5QrCodeScanner.clear();
          } else {
            html5QrCodeScanner.pause();
            toast.error("Error", { description: status.message });
            setTimeout(() => {
              html5QrCodeScanner.resume();
            }, 1000);
          }
        });
      } else {
        const errorMessage: string = result.error.flatten().formErrors[0];
        toast.error("Error", { description: errorMessage });
        html5QrCodeScanner.pause();

        setTimeout(() => {
          html5QrCodeScanner.resume();
        }, 1000);
      }

      html5QrCodeScanner.clear();
    }

    function onScanError(decodedText: string): void {
      toast("Error", {
        description: `Equipment with ID: ${decodedText} is not found`,
      });
      html5QrCodeScanner.clear();
    }

    html5QrCodeScanner.render(onScanSuccess, onScanError);
  }, [router]);

  return (
    <div className="space-y-4 mx-3 sm:mx-auto">
      <h1 className="font-semibold text-lg">Equipment QR Code Scanner</h1>
      <div
        className="sm:w-[300px] h-[270px] text-center shadow border"
        id="qr-reader"
      />
    </div>
  );
}
