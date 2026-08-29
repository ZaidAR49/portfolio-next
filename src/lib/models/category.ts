import z from "zod";

export const CategorySchema = z.object({
    id: z.number().int().positive().optional().nullable(),
    user_id: z.number().int().positive().optional().nullable(),
    name: z
        .string()
        .trim()
        .min(1, "Category name must be at least 1 character")
        .max(100, "Category name must be at most 100 characters"),
    sort_order: z.number().int().optional().nullable(),
});

export type Category = z.infer<typeof CategorySchema>;

export const CreateCategoryInputSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Category name must be at least 1 character")
        .max(100, "Category name must be at most 100 characters"),
    user_id: z.number().int().positive("Invalid user ID"),
});

export const UpdateCategoryInputSchema = z.object({
    id: z.number().int().positive("Invalid category ID"),
    name: z
        .string()
        .trim()
        .min(1, "Category name must be at least 1 character")
        .max(100, "Category name must be at most 100 characters"),
});

