"use server";
import { getActiveCategories, getCategoriesByUserId, addCategory, deleteCategory, updateCategory } from "@/lib/services/category-service";
import { Category } from "@/lib/models/category";
import { checkAuth } from "@/lib/auth";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

async function getAuthOrThrow() {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_code")?.value;
    if (!token) throw new Error("Unauthorized");
    const auth = await checkAuth(token);
    if (!auth) throw new Error("Unauthorized");
}

export async function getActiveCategoriesAction(): Promise<Category[]> {
    try {
        return await getActiveCategories();
    } catch (error) {
        console.error("Error getting active categories:", error);
        throw error;
    }
}

export async function getCategoriesByUserIdAction(userId: number): Promise<Category[]> {
    await getAuthOrThrow();
    try {
        return await getCategoriesByUserId(userId);
    } catch (error) {
        console.error("Error getting categories by userId:", error);
        throw error;
    }
}

export async function addCategoryAction(name: string, userId: number): Promise<Category> {
    await getAuthOrThrow();
    try {
        const result = await addCategory(name, userId);
        revalidatePath("/projects");
        return result;
    } catch (error) {
        console.error("Error adding category:", error);
        throw error;
    }
}

export async function deleteCategoryAction(id: number): Promise<void> {
    await getAuthOrThrow();
    try {
        await deleteCategory(id);
        revalidatePath("/projects");
    } catch (error) {
        console.error("Error deleting category:", error);
        throw error;
    }
}

export async function updateCategoryAction(id: number, name: string): Promise<Category> {
    await getAuthOrThrow();
    try {
        const result = await updateCategory(id, name);
        revalidatePath("/projects");
        return result;
    } catch (error) {
        console.error("Error updating category:", error);
        throw error;
    }
}
