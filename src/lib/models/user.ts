import z from "zod";

export const UserSchema = z.object({
    id: z.number(),
    name: z.string().min(2, "Name must be at least 2 characters long"),
    job_title: z.string().min(2, "Job title must be at least 2 characters long"),
    email: z.string().email("Invalid email"),
    hero_description: z.string().min(10, "Hero description must be at least 10 characters long"),
    about_description: z.string().min(10, "About description must be at least 10 characters long"),
    capabilities_description: z.string().min(10, "Capabilities description must be at least 10 characters long"),
    about_title: z.string().min(2, "About title must be at least 2 characters long"),
    linkedin_url: z.string().url("Invalid URL"),
    github_url: z.string().url("Invalid URL"),
    resume_url: z.string().url("Invalid URL"),
    picture_url: z.string().url().nullable(),
    portfolio_name: z.string().min(2, "Portfolio name must be at least 2 characters long"),
    is_active: z.boolean(),
});
export type User = z.infer<typeof UserSchema>;