"use server";
import { getUsersCount } from "@/lib/services/user-service";
import { getExperiencesCount } from "@/lib/services/experience-service";
import { getProjectsCount } from "@/lib/services/project-service";
import { getSkillsCount } from "@/lib/services/skills-service";
import { checkAuth } from "@/lib/auth";
import { cookies } from "next/headers";

export const getAnalysisAction = async () => {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth_code')?.value;
        if (!token) {
            return { success: false, message: "Unauthorized", status: 401 };
        }
        const auth = await checkAuth(token);
        if (!auth) {
            return { success: false, message: "Unauthorized", status: 401 };
        }
        const usersCount = await getUsersCount();
        const experiencesCount = await getExperiencesCount();
        const projectsCount = await getProjectsCount();
        const skillsCount = await getSkillsCount();
        return {
            usersCount,
            experiencesCount,
            projectsCount,
            skillsCount
        };
    } catch (error) {
        console.error("Error getting analysis:", error);
        throw error;
    }
}