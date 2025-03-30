import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function sleep(time: number = 3000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export function formatDate(date: Date | null): string | null {
  if (!date) {
    return null;
  }
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

export function formatCurrency({
  number,
  format = "id-ID",
  currency = "IDR",
}: {
  number: number;
  format?: string;
  currency?: string;
}) {
  return new Intl.NumberFormat(format, {
    style: "currency",
    currency: currency,
  }).format(number);
}
