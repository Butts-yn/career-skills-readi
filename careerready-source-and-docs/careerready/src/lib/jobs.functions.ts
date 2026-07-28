import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const listJobApplications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("job_applications")
      .select("*")
      .eq("user_id", context.userId)
      .order("applied_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  });

export const applyToJob = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        role: z.string().min(1),
        company: z.string().min(1),
        notes: z.string().optional(),
      })
      .parse(input)
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("job_applications").insert({
      user_id: context.userId,
      role: data.role,
      company: data.company,
      notes: data.notes ?? null,
    });

    if (error) throw error;
    return { ok: true };
  });

export const updateApplicationStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        id: z.string().uuid(),
        status: z.string().min(1),
      })
      .parse(input)
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase
      .from("job_applications")
      .update({ status: data.status })
      .eq("id", data.id)
      .eq("user_id", context.userId);

    if (error) throw error;
    return { ok: true };
  });
