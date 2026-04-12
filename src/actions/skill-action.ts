"use server";
import { Skill, SkillSchema } from "@/lib/models/skill";
import { addSkill, deleteSkill, getSkills, updateSkill, getActiveSkills } from "@/lib/services/skills-service";
import { revalidatePath } from "next/cache";

export async function addSkillAction(skill: Skill) {
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
    try {
        revalidatePath("/");
        return await deleteSkill(id);
    } catch (error) {
        console.error("Error deleting skill:", error);
        throw error;
    }
}
export async function getSkillsAction() {
    try {
        return await getSkills();
    } catch (error) {
        console.error("Error getting skills:", error);
        throw error;
    }
}