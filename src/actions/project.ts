"use server";

import { revalidatePath } from "next/cache";
import supabase from "@/config/database-conection";
import { deleteImagesHelper } from "@/lib/utils/server/cloud-helper";

export type ProjectInput = {
    id?: string | number;
    user_id?: string | number;
    title: string;
    client: string;
    role: string;
    year: string;
    status: string;
    sort_order: number;
    description: string;
    github_url: string;
    technologies: any[];
    images: string[];
};

export const getProjectsCount = async () => {
    try {
        const { count, error } = await supabase
            .from("projects")
            .select("*", { count: "exact", head: true });

        if (error) throw error;
        return { success: true, data: count };
    } catch (error: any) {
        console.error("Error getting projects count:", error);
        return { success: false, error: error.message || "Failed to get projects count" };
    }
};

export const addManyProjects = async (userId: string | number, projects: ProjectInput[]) => {
    try {
        if (!projects || projects.length === 0) {
            return { success: false, error: "Missing required fields" };
        }
        
        const parsedProjects = projects.map(project => ({
            user_id: userId,
            title: project.title,
            client: project.client,
            role: project.role,
            year: project.year,
            status: project.status,
            sort_order: project.sort_order,
            description: project.description,
            github_url: project.github_url,
            technologies: project.technologies,
            images: project.images
        }));

        const { data, error } = await supabase
            .from("projects")
            .insert(parsedProjects)
            .select();

        if (error) throw error;

        revalidatePath("/");
        return { success: true, data };
    } catch (error: any) {
        console.error("Error adding projects:", error);
        return { success: false, error: error.message || "Failed to add projects" };
    }
};

export const addProject = async (project: ProjectInput) => {
    try {
        if (!project.title || !project.client || !project.role || !project.year || !project.status || project.sort_order === undefined || !project.description || !project.github_url || !project.technologies || !project.images) {
            return { success: false, error: "Missing required fields" };
        }

        let userId = project.user_id;

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

        const projectData = {
            ...project,
            user_id: userId
        };

        const { data, error } = await supabase
            .from("projects")
            .insert(projectData)
            .select()
            .single();

        if (error) throw error;

        revalidatePath("/");
        return { success: true, data };
    } catch (error: any) {
        console.error("Error adding project:", error);
        return { success: false, error: error.message || "Failed to add project" };
    }
};

export const getProjectByUserId = async (userId: string | number) => {
    try {
        if (!userId) {
            return { success: false, error: "Missing required fields" };
        }

        const { data, error } = await supabase
            .from("projects")
            .select("*")
            .eq("user_id", userId)
            .order("sort_order", { ascending: true });

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        console.error("Error getting projects:", error);
        return { success: false, error: error.message || "Failed to get projects" };
    }
};

export const getProjectById = async (id: string | number) => {
    try {
        if (!id) {
            return { success: false, error: "Missing required fields" };
        }

        const { data, error } = await supabase
            .from("projects")
            .select("*")
            .eq("id", id)
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error: any) {
        console.error("Error getting project by id:", error);
        return { success: false, error: error.message || "Failed to get project" };
    }
};

export const deleteProject = async (id: string | number) => {
    let deletedProject: any;
    try {
        if (!id) {
            return { success: false, error: "Missing required fields" };
        }

        const { data, error: error1 } = await supabase
            .from("projects")
            .delete()
            .eq("id", id)
            .select()
            .single();

        if (error1) throw error1;
        if (!data) return { success: false, error: "Project not found or already deleted" };

        deletedProject = data;

        let result: any;
        try {
            result = await deleteImagesHelper(data.images || []);
        } catch (error2: any) {
            // rollback
            await supabase.from("projects").insert(deletedProject);
            throw error2;
        }

        revalidatePath("/");
        return { success: true, message: "Project deleted successfully", data };
    } catch (error: any) {
        console.error("Error deleting project:", error);
        if (deletedProject) {
            await supabase.from("projects").insert(deletedProject);
        }
        return { success: false, error: error.message || "Failed to delete project" };
    }
};

export const updateProject = async (project: ProjectInput) => {
    try {
        if (!project.id || !project.title || !project.client || !project.role || !project.year || !project.status || project.sort_order === undefined || !project.description || !project.github_url || !project.technologies || !project.images) {
             return { success: false, error: "Missing required fields" };
        }

        const { data, error } = await supabase
            .from("projects")
            .update({
                title: project.title,
                client: project.client,
                role: project.role,
                year: project.year,
                status: project.status,
                sort_order: project.sort_order,
                description: project.description,
                github_url: project.github_url,
                technologies: project.technologies,
                images: project.images
            })
            .eq("id", project.id)
            .select()
            .single();

        if (error) throw error;

        revalidatePath("/");
        return { success: true, data };
    } catch (error: any) {
        console.error("Error updating project:", error);
        return { success: false, error: error.message || "Failed to update project" };
    }
};

export const swapProjectSortOrder = async (projects: { first: { id: string | number, sort_order: number }, second: { id: string | number, sort_order: number } }) => {
    try {
        if (!projects || !projects.first || !projects.second) {
             return { success: false, error: "Missing required fields" };
        }

        const { data: data1, error: error1 } = await supabase
            .from("projects")
            .update({ sort_order: projects.first.sort_order })
            .eq("id", projects.first.id)
            .select()
            .single();

        const { data: data2, error: error2 } = await supabase
            .from("projects")
            .update({ sort_order: projects.second.sort_order })
            .eq("id", projects.second.id)
            .select()
            .single();

        if (error1 || error2) throw (error1 || error2);

        revalidatePath("/");
        return { 
            success: true, 
            data: {
                first_project_ID: data1.id,
                first_project_sort_order: data1.sort_order,
                second_project_ID: data2.id,
                second_project_sort_order: data2.sort_order
            }
        };
    } catch (error: any) {
        console.error("Error swapping project sort order:", error);
        return { success: false, error: error.message || "Failed to update sort order" };
    }
};

export const updateProjectSortOrder = async (id: string | number, sort_order: number) => {
    try {
        if (sort_order === undefined || !id) {
             return { success: false, error: "Missing required fields" };
        }

        const { data, error } = await supabase
            .from("projects")
            .update({ sort_order })
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;

        revalidatePath("/");
        return { success: true, data };
    } catch (error: any) {
        console.error("Error updating project sort order:", error);
        return { success: false, error: error.message || "Failed to update project sort order" };
    }
};

export const activeProjects = async () => {
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
            .from("projects")
            .select("*")
            .eq("user_id", user.id)
            .order("sort_order", { ascending: true });

        if (error) throw error;

        return { success: true, data };
    } catch (error: any) {
        console.error("Error getting active projects:", error);
        return { success: false, error: error.message || "Failed to get active projects" };
    }
};
