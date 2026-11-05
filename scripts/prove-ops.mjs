import { readFileSync } from "fs";

const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .flatMap((line) => {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
      return match ? [[match[1], match[2].replace(/^"|"$/g, "")]] : [];
    }),
);

const base = "http://127.0.0.1:3000";
const guest = await fetch(`${base}/ops`, { redirect: "manual" });
const guestLocation = guest.headers.get("location") ?? "";
console.log("ops_guest", guest.status, guestLocation.includes("/login") ? "redirects_login" : guestLocation);

const loginPage = await fetch(`${base}/login?next=/ops`);
const loginHtml = await loginPage.text();
console.log("login_page", loginPage.status, loginHtml.includes("Iniciar sesión") ? "ok" : "unexpected");

const body = new URLSearchParams({
  email: "admin",
  password: env.ADMIN_PASSWORD ?? "",
  next: "/ops",
});
const login = await fetch(`${base}/login`, {
  method: "POST",
  headers: { "content-type": "application/x-www-form-urlencoded" },
  body,
  redirect: "manual",
});
const setCookie = login.headers.getSetCookie?.() ?? [];
const cookie = setCookie.map((item) => item.split(";")[0]).join("; ");
console.log("login_post", login.status, cookie.includes("somostrac_admin") ? "cookie_set" : "no_cookie");

const ops = await fetch(`${base}/ops`, { headers: { cookie }, redirect: "follow" });
const html = await ops.text();
console.log(
  "ops_auth",
  ops.status,
  html.includes("Calendario") ? "calendar" : "no_calendar",
  html.includes("Gallagro") ? "gallagro" : "no_client",
  html.includes("Falta Neon") ? "missing_db" : "db_ok",
);
