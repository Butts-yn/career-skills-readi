import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { z } from "zod";

export const getCompletedResources = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("learning_progress")
      .select("resource_id")
      .eq("user_id", context.userId);

    if (error) throw error;
    return new Set(data?.map((r) => r.resource_id) ?? []);
  });

export const markResourceComplete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z
      .object({
        resourceId: z.string().min(1),
      })
      .parse(input)
  )
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from("learning_progress").upsert(
      {
        user_id: context.userId,
        resource_id: data.resourceId,
      },
      { onConflict: "user_id, resource_id" }
    );

    if (error) throw error;
    return { ok: true };
  });
