"use server";

import { revalidatePath } from "next/cache";
import supabase from "@/config/database-conection";
import { deletePictureHelper } from "@/lib/utils/server/cloud-helper";

export type UserInput = {
    id?: string | number;
    email: string;
    name: string;
    job_title: string;
    hero_description: string;
    about_description: string;
    capabilities_description: string;
    about_title: string;
    linkedin_url: string;
    github_url: string;
    resume_url: string;
    picture_url?: string;
    portfolio_name: string;
    is_active?: boolean;
};

export const getUsersCount = async () => {
    try {
        const { count, error } = await supabase
            .from("users")
            .select("*", { count: "exact", head: true });

        if (error) throw error;
        return { success: true, data: count };
    } catch (error: any) {
        console.error("Error getting users count:", error);
        return { success: false, error: error.message || "Failed to get users count" };
    }
};

export const addUser = async (user: UserInput) => {
    try {
        if (!user.email || !user.name || !user.job_title || !user.hero_description || !user.about_description || !user.capabilities_description || !user.about_title || !user.linkedin_url || !user.github_url || !user.resume_url || !user.portfolio_name) {
            return { success: false, error: "Missing required fields" };
        }

        const { data, error } = await supabase
            .from("users")
            .insert({ ...user, is_active: user.is_active ?? true })
            .select()
            .single();

        if (error) {
            return { success: false, error: "Failed to add user (conflict or error)" };
        }

        revalidatePath("/");
        return { success: true, data };
    } catch (error: any) {
        console.error("Error adding user:", error);
        return { success: false, error: error.message || "Failed to add user" };
    }
};

export const getAllUsers = async () => {
    try {
        const { data: users, error } = await supabase
            .from("users")
            .select("*")
            .order("id", { ascending: true });

        if (error) throw error;
        return { success: true, data: users };
    } catch (error: any) {
        console.error("Error getting users:", error);
        return { success: false, error: error.message || "Failed to get users" };
    }
};

export const getUserByPortfolioName = async (portfolioName: string) => {
    try {
        const { data: user, error } = await supabase
            .from("users")
            .select("*")
            .eq("portfolio_name", portfolioName)
            .single();

        if (error) throw error;
        return { success: true, data: user };
    } catch (error: any) {
        console.error("Error getting user:", error);
        return { success: false, error: error.message || "Failed to get user" };
    }
};

export const updateUser = async (user: UserInput) => {
    try {
        if (!user.id || !user.email || !user.name || !user.job_title || !user.hero_description || !user.about_description || !user.capabilities_description || !user.about_title || !user.linkedin_url || !user.github_url || !user.resume_url || !user.portfolio_name) {
            return { success: false, error: "Missing required fields" };
        }

        // Get the old user picture_url
        const { data: oldUser } = await supabase
            .from("users")
            .select("picture_url")
            .eq("id", user.id)
            .single();

        const { data, error } = await supabase
            .from("users")
            .update(user)
            .eq("id", user.id)
            .select()
            .single();

        if (error) throw error;

        // If picture changed, delete the old one
        if (oldUser?.picture_url && oldUser.picture_url !== user.picture_url) {
            await deletePictureHelper(oldUser.picture_url);
        }

        revalidatePath("/");
        return { success: true, data };
    } catch (error: any) {
        console.error("Error updating user:", error);
        return { success: false, error: error.message || "Failed to update user" };
    }
};

export const deleteUser = async (id: string | number) => {
    let deletedUser: any;
    try {
        if (!id) {
            return { success: false, error: "Missing required fields" };
        }

        const { data, error: error1 } = await supabase
            .from("users")
            .delete()
            .eq("id", id)
            .select()
            .single();

        if (error1) throw error1;
        if (!data) return { success: false, error: "User not found or already deleted" };

        deletedUser = data;

        const { result, error: error2 } = await deletePictureHelper(data.picture_url);

        if (error2) {
            // rollback
            await supabase.from("users").insert(deletedUser);
            throw error2;
        }

        revalidatePath("/");
        return { success: true, message: "Deleted successfully", data };
    } catch (error: any) {
        console.error("Error deleting user:", error);
        if (deletedUser) {
            await supabase.from("users").insert(deletedUser);
        }
        return { success: false, error: error.message || "Failed to delete user" };
    }
};

export const activateUser = async (id: string | number) => {
    try {
        if (!id) {
            return { success: false, error: "Missing required fields" };
        }

        const { data, error } = await supabase
            .from("users")
            .update({ is_active: true })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        if (!data) return { success: false, error: "User not found or already active" };

        revalidatePath("/");
        return { success: true, message: "Activated successfully", data };
    } catch (error: any) {
        console.error("Error activating user:", error);
        return { success: false, error: error.message || "Failed to activate user" };
    }
};

export const deactivateUser = async (id: string | number) => {
    try {
        if (!id) {
            return { success: false, error: "Missing required fields" };
        }

        const { data, error } = await supabase
            .from("users")
            .update({ is_active: false })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        if (!data) return { success: false, error: "User not found or already deactivated" };

        revalidatePath("/");
        return { success: true, message: "Deactivated successfully", data };
    } catch (error: any) {
        console.error("Error deactivating user:", error);
        return { success: false, error: error.message || "Failed to deactivate user" };
    }
};

export const getActiveUser = async () => {
    try {
        const { data: users, error } = await supabase
            .from("users")
            .select("*")
            .eq("is_active", true)
            .limit(1);

        if (error) throw error;

        if (users && users.length > 0) {
            return { success: true, data: users[0] };
        } else {
            return { success: true, data: null };
        }
    } catch (error: any) {
        console.error("Error getting active user:", error);
        return { success: false, error: error.message || "Failed to get users" };
    }
};


