import { CircleAlert, CircleCheck } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

type AlertProps = {
  variant?: "default" | "destructive" | null | undefined;
  header?: string;
  message?: string;
  className?: string;
};

export function CustomAlert({
  variant,
  header,
  message,
  className,
}: AlertProps) {
  const alertVariant: "default" | "destructive" | null | undefined =
    variant ?? "default";

  return (
    <Alert variant={alertVariant} className={className}>
      {alertVariant == "default" ? <CircleCheck /> : <CircleAlert />}
      <AlertTitle>{header ?? "Error"}</AlertTitle>
      <AlertDescription>{message ?? "Error occured"}</AlertDescription>
    </Alert>
  );
}
