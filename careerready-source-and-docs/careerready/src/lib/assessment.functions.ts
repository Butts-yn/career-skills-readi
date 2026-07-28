import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

const scoreSchema = z.record(z.number().min(1).max(5));

export const getLatestAssessment = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("assessment_scores")
      .select("*")
      .eq("user_id", context.userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;
    return data;
  });

export const saveAssessment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        scores: scoreSchema,
        average: z.number(),
        focus_areas: z.array(z.string()),
      })
      .parse(input)
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("assessment_scores").insert({
      user_id: context.userId,
      scores: data.scores,
      average: data.average,
      focus_areas: data.focus_areas,
    });

    if (error) throw error;
    return { ok: true };
  });
