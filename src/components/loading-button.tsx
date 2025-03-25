import React from "react";
import { Button } from "./ui/button";

interface LoadingButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  processing?: boolean;
}

export default function LoadingButton({
  label,
  processing,
  ...props
}: LoadingButtonProps) {
  return (
    <Button disabled={processing} {...props}>
      {processing ? "Loading.." : label ?? "Submit"}
    </Button>
  );
}
