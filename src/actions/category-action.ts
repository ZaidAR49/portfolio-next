"use server";
import { getActiveCategories } from "@/lib/services/category-service";
import { Category } from "@/lib/models/category";

export async function getActiveCategoriesAction(): Promise<Category[]> {
    try {
        return await getActiveCategories();
    } catch (error) {
        console.error("Error getting active categories:", error);
        throw error;
    }
}
