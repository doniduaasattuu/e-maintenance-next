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

export function handleScrollToBottom() {
  setTimeout(() => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  }, 100);
}

export function uppercaseFirstLetter(str: string) {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function isUUID(str: string) {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(str);
}

export function stringToBoolean(bool: string): boolean {
  if (bool === "true") {
    return true;
  } else {
    return false;
  }
}

export function booleanToString(bool: boolean): "true" | "false" {
  if (bool) {
    return "true";
  } else {
    return "false";
  }
}
