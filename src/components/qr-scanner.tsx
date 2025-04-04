"use client";

import React, { useRef, useState } from "react"; // Import useRef
import { Html5QrcodeScanner } from "html5-qrcode";
import { useRouter } from "next/navigation";
import z from "zod";
import { isEquipmentExist } from "@/actions/equipment-action";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { AlertCircle } from "lucide-react";

export default function QRScanner() {
  const router = useRouter();
  const qrCodeId = "qr-reader";
  const formatEquipment = z
    .string()
    .length(9, { message: "Code must be 9 characters" })
    .regex(/^[A-Z]{3}\d{6}$/, {
      message: "Format code is invalid. Example: EMO123456",
    });

  const scannerRef = useRef<Html5QrcodeScanner | null>(null); // Gunakan useRef
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [errorHeader, setErrorHeader] = useState<string | null>(null);

  React.useEffect(() => {
    // Hanya inisialisasi scanner jika belum ada
    if (!scannerRef.current) {
      scannerRef.current = new Html5QrcodeScanner(
        "qr-reader",
        {
          fps: 10,
          qrbox: { width: 300, height: 300 },
          useBarCodeDetectorIfSupported: true,
        },
        false
      );

      function onScanSuccess(decodedText: string) {
        const result = formatEquipment.safeParse(decodedText);

        if (result.success) {
          const equipment: string = result.data;
          const response = isEquipmentExist(equipment);

          setErrorHeader(null);
          setErrorMessage(null);

          response.then((status) => {
            if (status.success) {
              if (scannerRef.current) {
                scannerRef.current.clear().then(() => {
                  router.push(`/equipments/${equipment}`);
                });
              }
            } else {
              if (scannerRef.current) {
                scannerRef.current.pause();
                // toast.error("QR Error", { description: status.message });
                // errorHeader.current = "QR Error";
                // errorMessage.current = status.message;

                setErrorHeader("QR Error");
                setErrorMessage(status.message);
                setTimeout(() => {
                  if (scannerRef.current) {
                    scannerRef.current.resume();
                  }
                }, 1000);
              }
            }
          });
        } else {
          const errorValidationMessage: string =
            result.error.flatten().formErrors[0];
          // toast.error("Validation Error", {
          //   description: errorValidationMessage,
          // });
          setErrorHeader("Validation Error");
          setErrorMessage(errorValidationMessage);

          if (scannerRef.current) {
            scannerRef.current.pause();
            setTimeout(() => {
              if (scannerRef.current) {
                scannerRef.current.resume();
              }
            }, 1000);
          }
        }
      }

      function onScanError(decodedText: string): void {
        console.log(decodedText);
      }

      if (scannerRef.current !== null) {
        scannerRef.current.render(onScanSuccess, onScanError);
      }
    }

    // Bersihkan scanner saat komponen unmount
    // return () => {
    //   if (scannerRef.current) {
    //     console.log(`Fifth: ${scannerRef.current}`); // NOT PRINTED
    //     scannerRef.current.clear();
    //   }
    // };
  }, [formatEquipment, router]);

  return (
    <div className="space-y-4 mx-3 sm:mx-auto">
      <h1 className="font-semibold text-lg">Equipment QR Code Scanner</h1>
      <div
        className="sm:w-[300px] h-[270px] text-center shadow border"
        id={qrCodeId}
      />
      {errorHeader && errorMessage && (
        <Alert variant="destructive" className="max-w-[300px]">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{errorHeader}</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
