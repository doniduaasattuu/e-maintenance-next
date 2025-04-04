export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 5MB
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "NextJS App";
export const ALLOWED_FILE_TYPES: readonly [string, ...string[]] = [
  "pdf",
  "xlsx",
  "docx",
  "jpg",
  "png",
];
