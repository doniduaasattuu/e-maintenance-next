"use client";

import React from "react";
import * as QRCodeReact from "qrcode.react";

export default function QRGenerator() {
  return (
    <div className="bg-white p-2">
      <QRCodeReact.QRCodeCanvas value="String yang akan diubah menjadi QR Code" />
    </div>
  );
}
