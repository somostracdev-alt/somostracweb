import { cookies } from "next/headers";
import { cache } from "react";

import { localeCookie, type Locale } from "@/lib/locale";

export const getLocale = cache(async (): Promise<Locale> => {
  const store = await cookies();
  return store.get(localeCookie)?.value === "en" ? "en" : "es";
});
