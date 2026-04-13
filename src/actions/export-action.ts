"use server";

import { getActiveUserAction } from "./user-action";
import { getActiveProjectsAction } from "./project-action";
import { getActiveSkillsAction } from "./skill-action";
import { getActiveExperiencesAction } from "./experience-action";

export async function getExportDataAction() {
    try {
        const [activeUser, activeProjects, activeSkills, activeExperiences] = await Promise.all([
            getActiveUserAction(),
            getActiveProjectsAction(),
            getActiveSkillsAction(),
            getActiveExperiencesAction(),
        ]);

        return {
            user: activeUser,
            projects: activeProjects,
            skills: activeSkills,
            experiences: activeExperiences,
            exportedAt: new Date().toISOString(),
        };
    } catch (error) {
        console.error("Error generating export data:", error);
        throw new Error("Failed to export complete user data.");
    }
}
