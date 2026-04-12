import z from "zod";

export const ExperienceSchema = z.object({
    id: z.number().optional(),
    user_id: z.number().optional(),
    role: z.string().min(2, "Role must be at least 2 characters long"),
    period: z.string().min(2, "Period must be at least 2 characters long"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    company: z.string().min(2, "Company must be at least 2 characters long"),
});
export type Experience = z.infer<typeof ExperienceSchema>;