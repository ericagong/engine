import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 유니크 ID 생성 유틸
let counter = 0;
export function uid(): string {
  return `${Date.now()}-${++counter}`;
}
