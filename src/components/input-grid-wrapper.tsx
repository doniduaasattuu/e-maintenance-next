import React from "react";

export default function InputGridWrapper({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <div className={`grid space-x-2 sm:space-x-4 items-start ${className}`}>
      {children}
    </div>
  );
}
