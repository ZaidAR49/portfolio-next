"use server";

import { revalidatePath } from "next/cache";
import supabase from "@/config/database-conection";

export type SkillInput = {
    id?: string | number;
    user_id?: string | number;
    name: string;
    type: "primary" | "secondary";
    icon?: string;
};

export const getSkillsCount = async () => {
    try {
        const { count, error } = await supabase
            .from("skills")
            .select("*", { count: "exact", head: true });

        if (error) throw error;
        return { success: true, data: count };
    } catch (error: any) {
        console.error("Error getting skills count:", error);
        return { success: false, error: error.message || "Failed to get skills count" };
    }
};

export const addManySkills = async (userId: string | number, skills: { main?: any[], secondary?: any[] }) => {
    try {
        if (!skills) {
            return { success: false, error: "Invalid skills data" };
        }

        const mainSkills = skills.main || [];
        const secondarySkills = skills.secondary || [];
        const parsedSkills: any[] = [];

        mainSkills.forEach((skill: any) => {
            parsedSkills.push({
                name: skill.name,
                type: skill.type || "primary",
                user_id: userId,
                icon: skill.icon
            });
        });

        secondarySkills.forEach((skill: any) => {
            parsedSkills.push({
                name: skill.name,
                type: skill.type || "secondary",
                user_id: userId,
                icon: skill.icon
            });
        });

        if (parsedSkills.length === 0) {
            return { success: true, message: "No skills to add", data: [] };
        }

        const { data, error } = await supabase
            .from("skills")
            .insert(parsedSkills)
            .select();

        if (error) throw error;

        revalidatePath("/");
        return { success: true, data };
    } catch (error: any) {
        console.error("Failed to add skills:", error);
        return { success: false, error: error.message || "Failed to add skills" };
    }
};

export const addSkill = async (skill: SkillInput) => {
    try {
        if (!skill.name || !skill.type) {
            return { success: false, error: "Missing required fields" };
        }

        let userId = skill.user_id;

        if (!userId) {
            const { data: user, error: userError } = await supabase
                .from("users")
                .select("id")
                .eq("is_active", true)
                .limit(1)
                .single();

            if (userError || !user?.id) {
                return { success: false, error: "Unauthenticated: User ID could not be fetched" };
            }
            userId = user.id;
        }

        const { data, error } = await supabase
            .from("skills")
            .insert({
                user_id: userId,
                name: skill.name,
                type: skill.type,
                icon: skill.icon
            })
            .select()
            .single();

        if (error) throw error;

        revalidatePath("/");
        return { success: true, message: "Skill added successfully", data };
    } catch (error: any) {
        console.error("Failed to add skill:", error);
        return { success: false, error: error.message || "Failed to add skill" };
    }
};

export const getAllSkills = async (user_id: string | number) => {
    try {
        if (!user_id) {
            return { success: false, error: "Missing required fields" };
        }

        const { data, error } = await supabase
            .from("skills")
            .select("*")
            .eq("user_id", user_id);

        if (error) throw error;

        return { success: true, data };
    } catch (error: any) {
        console.error("Failed to get skills:", error);
        return { success: false, error: error.message || "Failed to get skills" };
    }
};

export const updateSkill = async (skill: SkillInput) => {
    try {
        if (!skill.id || !skill.name || !skill.type) {
            return { success: false, error: "Missing required fields" };
        }

        const { data, error } = await supabase
            .from("skills")
            .update({
                name: skill.name,
                type: skill.type,
                icon: skill.icon
            })
            .eq("id", skill.id)
            .select()
            .single();

        if (error) throw error;

        revalidatePath("/");
        return { success: true, message: "Skill updated successfully", data };
    } catch (error: any) {
        console.error("Failed to update skill:", error);
        return { success: false, error: error.message || "Failed to update skill" };
    }
};

export const deleteSkill = async (id: string | number) => {
    try {
        if (!id) {
            return { success: false, error: "Missing required fields" };
        }

        const { data, error } = await supabase
            .from("skills")
            .delete()
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        revalidatePath("/");
        return { success: true, message: "Skill deleted successfully", data };
    } catch (error: any) {
        console.error("Failed to delete skill:", error);
        return { success: false, error: error.message || "Failed to delete skill" };
    }
};

export const activeSkills = async () => {
    try {
        const { data: user, error: userError } = await supabase
            .from("users")
            .select("id")
            .eq("is_active", true)
            .limit(1)
            .single();

        if (userError || !user?.id) {
            return { success: false, error: "No active user found" };
        }

        const { data, error } = await supabase
            .from("skills")
            .select("*")
            .eq("user_id", user.id);

        if (error) throw error;

        return { success: true, data };
    } catch (error: any) {
        console.error("Failed to get active skills:", error);
        return { success: false, error: error.message || "Failed to get active skills" };
    }
};
