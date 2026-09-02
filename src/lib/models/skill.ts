import z from "zod";

export const SkillSchema = z.object({
    id: z.number().optional(),
    user_id: z.number(),
    name: z.string().min(1, "Name must be at least 1 character long"),
    category_id: z.number().int().positive().optional().nullable(),
    type: z.string().optional().nullable(),
});
export type Skill = z.infer<typeof SkillSchema>;