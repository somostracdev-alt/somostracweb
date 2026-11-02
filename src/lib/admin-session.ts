import { timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import { cache } from "react";

const COOKIE_NAME = "somostrac_admin";
const COOKIE_VALUE = "active";

function sameSecret(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export const isAdminAuthenticated = cache(async () => {
  const store = await cookies();
  return store.get(COOKIE_NAME)?.value === COOKIE_VALUE;
});

export async function loginAsAdmin(password: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  if (!sameSecret(password, expected)) return false;

  const store = await cookies();
  store.set(COOKIE_NAME, COOKIE_VALUE, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return true;
}

export async function logoutAdmin() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
