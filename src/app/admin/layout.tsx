import { connection } from "next/server";
import { redirect } from "next/navigation";

import { AdminNav } from "@/components/admin-nav";
import { isAdminAuthenticated } from "@/lib/admin-session";

export const instant = false;

export const metadata = {
  title: "Admin",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await connection();
  if (!(await isAdminAuthenticated())) {
    redirect("/login?error=" + encodeURIComponent("Sesión de admin no válida"));
  }

  return (
    <div className="flex min-h-screen bg-white font-normal text-[#383838]">
      <AdminNav />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
