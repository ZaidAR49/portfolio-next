import z from "zod";

export const ProjectSchema = z.object({
    id: z.number(),
    user_id: z.number(),
    title: z.string().min(2, "Title must be at least 2 characters long"),
    client: z.string().min(2, "Client must be at least 2 characters long"),
    role: z.string().min(2, "Role must be at least 2 characters long"),
    year: z.number().min(4, "Year must be at least 4 digits long"),
    status: z.string().min(2, "Status must be at least 2 characters long"),
    sort_order: z.number().min(1, "Sort order must be at least 1"),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    github_url: z.string().url("Invalid URL"),
    technologies: z.array(z.string()),
    images: z.array(z.string()),
});
export type Project = z.infer<typeof ProjectSchema>;