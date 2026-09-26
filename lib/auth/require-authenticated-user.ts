import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function requireAuthenticatedUser() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims) {
    redirect("/login");
  }

  return { supabase, claims: data.claims };
}
