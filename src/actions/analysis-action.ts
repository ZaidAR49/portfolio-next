import { getUsersCount } from "@/lib/services/user-service";
import { getExperiencesCount } from "@/lib/services/experience-service";
import { getProjectsCount } from "@/lib/services/project-service";
import { getSkillsCount } from "@/lib/services/skills-service";

export const getAnalysisAction = async () => {
    try {
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