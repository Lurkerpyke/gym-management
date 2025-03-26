import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import prisma from "./prisma";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateRandomCode = (length: number) => {
  const charset = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude ambiguous characters
  return Array.from({ length }, () =>
    charset.charAt(Math.floor(Math.random() * charset.length))
  ).join('');
};

export const validateInviteCode = async (code: string) => {
  return await prisma.gymInvite.findFirst({
    where: {
      code,
      used: false,
      expiresAt: { gt: new Date() }
    }
  });
};
