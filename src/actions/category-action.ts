"use server";
import {
    getActiveCategories,
    getCategoriesByUserId,
    getCategoryById,
    addCategory,
    deleteCategory,
    updateCategory,
    bulkUpdateCategoryOrders,
} from "@/lib/services/category-service";
import {
    Category,
    CategoryType,
    CreateCategoryInputSchema,
    UpdateCategoryInputSchema,
} from "@/lib/models/category";
import { checkAuth } from "@/lib/auth";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import z from "zod";

const IdSchema = z.number().int().positive("Invalid ID");

async function getAuthOrThrow() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_code")?.value;
    if (!token) throw new Error("Unauthorized");
    const auth = await checkAuth(token);
    if (!auth) throw new Error("Unauthorized");
}

export async function getActiveCategoriesAction(type?: CategoryType): Promise<Category[]> {
    try {
        return await getActiveCategories(type);
    } catch (error) {
        console.error("Error getting active categories:", error);
        throw error;
    }
}

export async function getCategoriesByUserIdAction(userId: number, type?: CategoryType): Promise<Category[]> {
    await getAuthOrThrow();
    const parsedUserId = IdSchema.safeParse(userId);
    if (!parsedUserId.success) {
        throw new Error(parsedUserId.error.message);
    }
    try {
        return await getCategoriesByUserId(parsedUserId.data, type);
    } catch (error) {
        console.error("Error getting categories by userId:", error);
        throw error;
    }
}

export async function getCategoryByIdAction(id: number): Promise<Category | null> {
    await getAuthOrThrow();
    const parsedId = IdSchema.safeParse(id);
    if (!parsedId.success) {
        throw new Error(parsedId.error.message);
    }
    try {
        return await getCategoryById(parsedId.data);
    } catch (error) {
        console.error("Error getting category by id:", error);
        throw error;
    }
}

export async function addCategoryAction(
    name: string,
    userId: number,
    type: CategoryType = "project",
    sortOrder: number = 0
): Promise<Category> {
    await getAuthOrThrow();
    const validated = CreateCategoryInputSchema.safeParse({ name, user_id: userId, type });
    if (!validated.success) {
        throw new Error(validated.error.issues[0]?.message || "Invalid category data");
    }
    try {
        const result = await addCategory(validated.data.name, validated.data.user_id, validated.data.type, sortOrder);
        revalidatePath("/");
        revalidatePath("/projects");
        revalidatePath("/about");
        revalidatePath("/dashboard");
        return result;
    } catch (error) {
        console.error("Error adding category:", error);
        throw error;
    }
}

export async function deleteCategoryAction(id: number): Promise<void> {
    await getAuthOrThrow();
    const parsedId = IdSchema.safeParse(id);
    if (!parsedId.success) {
        throw new Error(parsedId.error.message);
    }
    try {
        await deleteCategory(parsedId.data);
        revalidatePath("/");
        revalidatePath("/projects");
        revalidatePath("/about");
        revalidatePath("/dashboard");
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
}

export async function updateCategoryAction(id: number, name: string): Promise<Category> {
    await getAuthOrThrow();
    const validated = UpdateCategoryInputSchema.safeParse({ id, name });
    if (!validated.success) {
        throw new Error(validated.error.issues[0]?.message || "Invalid category data");
    }
    try {
        const result = await updateCategory(validated.data.id, validated.data.name);
        revalidatePath("/");
        revalidatePath("/projects");
        revalidatePath("/about");
        revalidatePath("/dashboard");
        return result;
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
}

export async function bulkUpdateCategoryOrdersAction(updates: { id: number; sort_order: number }[]) {
    await getAuthOrThrow();
    try {
        await bulkUpdateCategoryOrders(updates);
        revalidatePath("/");
        revalidatePath("/projects");
        revalidatePath("/about");
        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Error bulk updating category orders:", error);
        throw error;
    }
}


