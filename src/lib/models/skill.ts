import z from "zod";

export const SkillSchema = z.object({
    id: z.number().optional(),
    user_id: z.number(),
    name: z.string().min(1, "Name must be at least 1 character long"),
    type: z.enum(["primary", "secondary"]),
});
export type Skill = z.infer<typeof SkillSchema>;