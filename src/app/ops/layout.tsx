import { connection } from "next/server";
import { redirect } from "next/navigation";

import { isAdminAuthenticated } from "@/lib/admin-session";

import "./ops.css";

export const instant = false;

export const metadata = {
  title: "Calendario",
};

export default async function OpsLayout({ children }: { children: React.ReactNode }) {
  await connection();
  if (!(await isAdminAuthenticated())) {
    redirect("/login?next=/ops");
  }

  return <div className="ops-app">{children}</div>;
}
