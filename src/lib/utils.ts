import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function sleep(time: number = 3000): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, time));
}
