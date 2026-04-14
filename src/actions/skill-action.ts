"use server";
import { Skill, SkillSchema } from "@/lib/models/skill";
import { addSkill, deleteSkill, getSkills, updateSkill, getActiveSkills } from "@/lib/services/skills-service";
import { revalidatePath } from "next/cache";
import { checkAuth } from "@/lib/auth";
import { cookies } from "next/headers";
export async function addSkillAction(skill: Skill) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_code')?.value;
    if (!token) {
        return { success: false, message: "Unauthorized", status: 401 };
    }
    const auth = await checkAuth(token);
    if (!auth) {
        return { success: false, message: "Unauthorized", status: 401 };
    }
    const validatedSkill = SkillSchema.safeParse(skill);
    if (!validatedSkill.success) {
        throw new Error(validatedSkill.error.message);
    }
    try {
        revalidatePath("/");
        return await addSkill(validatedSkill.data);
    } catch (error) {
        console.error("Error adding skill:", error);
        throw error;
    }
}
export async function getActiveSkillsAction() {
    try {
        return await getActiveSkills();
    } catch (error) {
        console.error("Error getting active skills:", error);
        throw error;
    }
}
export async function updateSkillAction(skill: Skill) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_code')?.value;
    if (!token) {
        return { success: false, message: "Unauthorized", status: 401 };
    }
    const auth = await checkAuth(token);
    if (!auth) {
        return { success: false, message: "Unauthorized", status: 401 };
    }
    const validatedSkill = SkillSchema.safeParse(skill);
    if (!validatedSkill.success) {
        throw new Error(validatedSkill.error.message);
    }
    try {
        revalidatePath("/");
        return await updateSkill(validatedSkill.data);
    } catch (error) {
        console.error("Error updating skill:", error);
        throw error;
    }
}
export async function deleteSkillAction(id: number) {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_code')?.value;
    if (!token) {
        return { success: false, message: "Unauthorized", status: 401 };
    }
    const auth = await checkAuth(token);
    if (!auth) {
        return { success: false, message: "Unauthorized", status: 401 };
    }
    try {
        revalidatePath("/");
        return await deleteSkill(id);
    } catch (error) {
        console.error("Error deleting skill:", error);
        throw error;
    }
}
export async function getSkillsAction() {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_code')?.value;
    if (!token) {
        return { success: false, message: "Unauthorized", status: 401 };
    }
    const auth = await checkAuth(token);
    if (!auth) {
        return { success: false, message: "Unauthorized", status: 401 };
    }
    try {
        return await getSkills();
    } catch (error) {
        console.error("Error getting skills:", error);
        throw error;
    }
}