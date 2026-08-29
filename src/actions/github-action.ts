"use server";

import {
  fetchGitHubStats,
  fetchGitHubRepositories,
  fetchGitHubRepoDetails,
  GitHubStatsData,
  GitHubRepoItem,
  GitHubImportableProject,
} from "@/lib/services/github-service";

export const getGitHubStatsAction = async (): Promise<GitHubStatsData | null> => {
  try {
    return await fetchGitHubStats();
  } catch (error) {
    console.error("Error in getGitHubStatsAction:", error);
    return null;
  }
};

export const getGitHubRepositoriesAction = async (): Promise<GitHubRepoItem[]> => {
  try {
    return await fetchGitHubRepositories();
  } catch (error) {
    console.error("Error in getGitHubRepositoriesAction:", error);
    return [];
  }
};

export const getGitHubRepoDetailsAction = async (repoName: string): Promise<GitHubImportableProject | null> => {
  try {
    return await fetchGitHubRepoDetails(repoName);
  } catch (error) {
    console.error(`Error in getGitHubRepoDetailsAction for ${repoName}:`, error);
    return null;
  }
};
