export const REGISTER_CODE: string =
  process.env.NEXT_PUBLIC_REGISTER_CODE ?? "E-Maintenance Next V4.0";
export const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "NextJS App";
export const ALLOWED_FILE_TYPES: readonly [string, ...string[]] = [
  "pdf",
  "xlsx",
  "docx",
  "jpg",
  "jpeg",
  "png",
];

export const ALLOWED_IMAGE_TYPES: readonly [string, ...string[]] = [
  "jpg",
  "jpeg",
  "png",
  "webp",
  "gif",
];

export const MAX_FILE_COUNT = 5;

export const onlyAdmin = ["Admin"];
export const management = ["Management", "Admin"];
export const leader = ["Leader", "Management", "Admin"];
export const users = ["User", "Leader", "Management", "Admin"];
