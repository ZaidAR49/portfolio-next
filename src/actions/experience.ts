"use server";

import { revalidatePath } from "next/cache";
import supabase from "../config/database-conection";

export type ExperienceInput = {
    id?: string | number;
    userID?: string | number;
    role: string;
    company: string;
    period: string;
    description: string;
};

export const getExperiencesCount = async () => {
    try {
        const { count, error } = await supabase
            .from("experiences")
            .select("*", { count: "exact", head: true });

        if (error) throw error;
        return { success: true, data: count };
    } catch (error: any) {
        console.error("Error getting experiences count:", error);
        return { success: false, error: error.message || "Failed to get experiences count" };
    }
};

export const addManyExperiences = async (userId: string | number, experiences: ExperienceInput[]) => {
    try {
        if (!experiences?.length) {
            return { success: false, error: "Missing required fields" };
        }
        const dataToInsert = experiences.map((experience) => ({
            user_id: userId,
            role: experience.role,
            company: experience.company,
            period: experience.period,
            description: experience.description
        }));

        const { data, error } = await supabase
            .from("experiences")
            .insert(dataToInsert)
            .select();

        if (error) throw error;

        revalidatePath("/");
        return { success: true, data };
    } catch (error: any) {
        console.error("Error adding experiences:", error);
        return { success: false, error: error.message || "Failed to add experiences" };
    }
};

export const addExperience = async (experience: ExperienceInput) => {
    try {
        if (!experience.role || !experience.company || !experience.period || !experience.description) {
            return { success: false, error: "Missing required fields" };
        }

        let userId = experience.userID;

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
            .from("experiences")
            .insert({
                user_id: userId,
                role: experience.role,
                company: experience.company,
                period: experience.period,
                description: experience.description
            })
            .select()
            .single();

        if (error) throw error;
        
        revalidatePath("/");
        return { success: true, data };
    } catch (error: any) {
        console.error("Error adding experience:", error);
        return { success: false, error: error.message || "Failed to add experience" };
    }
};

export const getExperienceByUserId = async (userId: string | number) => {
    try {
        if (!userId) {
            return { success: false, error: "Missing user ID" };
        }
        
        const { data, error } = await supabase
            .from("experiences")
            .select("*")
            .eq("user_id", userId);

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        console.error("Error getting experiences:", error);
        return { success: false, error: error.message || "Failed to get experiences" };
    }
};

export const getExperienceById = async (id: string | number) => {
    try {
        if (!id) {
            return { success: false, error: "Missing required fields" };
        }
        
        const { data, error } = await supabase
            .from("experiences")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        console.error("Error getting experience by id:", error);
        return { success: false, error: error.message || "Failed to get experience by id" };
    }
};

export const deleteExperience = async (id: string | number) => {
    try {
        if (!id) {
            return { success: false, error: "Missing required fields" };
        }
        
        const { data, error } = await supabase
            .from("experiences")
            .delete()
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        
        revalidatePath("/");
        return { success: true, data };
    } catch (error: any) {
        console.error("Error deleting experience:", error);
        return { success: false, error: error.message || "Failed to delete experience" };
    }
};

export const updateExperience = async (experience: ExperienceInput) => {
    try {
        if (!experience.id || !experience.role || !experience.company || !experience.period || !experience.description) {
            return { success: false, error: "Missing required fields" };
        }

        const { data, error } = await supabase
            .from("experiences")
            .update({
                role: experience.role,
                company: experience.company,
                period: experience.period,
                description: experience.description
            })
            .eq("id", experience.id)
            .select()
            .single();

        if (error) throw error;

        revalidatePath("/");
        return { success: true, data };
    } catch (error: any) {
        console.error("Error updating experience:", error);
        return { success: false, error: error.message || "Failed to update experience" };
    }
};

export const getActiveExperiences = async () => {
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
            .from("experiences")
            .select("*")
            .eq("user_id", user.id);

        if (error) throw error;

        return { success: true, data };
    } catch (error: any) {
        console.error("Error getting active experiences:", error);
        return { success: false, error: error.message || "Failed to get active experiences" };
    }
};
