import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const resumeSchema = z.object({
  full_name: z.string().optional(),
  role: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  summary: z.string().optional(),
  education: z.string().optional(),
  experience: z.string().optional(),
  skills: z.string().optional(),
});

export const getResume = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("resumes")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  });

export const saveResume = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => resumeSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { data: existing, error: findError } = await context.supabase
      .from("resumes")
      .select("id")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (findError) throw findError;

    if (existing) {
      const { error } = await context.supabase
        .from("resumes")
        .update(data)
        .eq("id", existing.id);
      if (error) throw error;
    } else {
      const { error } = await context.supabase.from("resumes").insert({
        user_id: context.userId,
        ...data,
      });
      if (error) throw error;
    }

    return { ok: true };
  });
