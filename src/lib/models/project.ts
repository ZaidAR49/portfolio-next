import z from "zod";

export const ProjectSchema = z.object({
    id: z.number().optional(),
    user_id: z.number().optional(),
    title: z.string().min(2, "Title must be at least 2 characters long"),
    client: z.string().min(2, "Client must be at least 2 characters long"),
    role: z.string().min(2, "Role must be at least 2 characters long"),
    year: z.union([z.string(), z.number()]).transform(val => Number(val)),
    status: z.string().min(2, "Status must be at least 2 characters long"),
    sort_order: z.union([z.string(), z.number()]).transform(val => Number(val)),
    description: z.string().min(10, "Description must be at least 10 characters long"),
    github_url: z.string().url("Invalid URL").or(z.literal("").transform(() => undefined)).optional(),
    technologies: z.array(z.string()),
    images: z.array(z.string()).optional().default([]),
});
export type Project = z.infer<typeof ProjectSchema>;

export const RequestProjectSchema = ProjectSchema.omit({ technologies: true }).extend({
    technologies: z.string().min(2, "Please provide at least one technology"),
    new_images: z.array(z.any()).optional(),
});
export type RequestProject = z.infer<typeof RequestProjectSchema>;