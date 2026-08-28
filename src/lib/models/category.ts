import z from "zod";

export const CategorySchema = z.object({
    id: z.number().optional().nullable(),
    user_id: z.number().optional().nullable(),
    name: z.string().min(1, "Category name must be at least 1 character"),
    sort_order: z.number().optional().nullable(),
});

export type Category = z.infer<typeof CategorySchema>;
