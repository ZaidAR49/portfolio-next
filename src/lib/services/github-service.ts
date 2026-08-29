export interface GitHubStatsData {
  publicRepos: number;
  totalStars: number;
  totalForks: number;
  followers: number;
  following: number;
  topLanguages: { name: string; count: number; percent: number }[];
  username: string;
  avatarUrl: string;
  profileUrl: string;
}

export interface GitHubRepoItem {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  topics: string[];
  created_at: string;
  updated_at: string;
  stargazers_count: number;
  forks_count: number;
  private: boolean;
}

export interface GitHubImportableProject {
  title: string;
  description: string;
  github_url: string;
  technologies: string;
  year: number;
  client: string;
  role: string;
  status: string;
}

interface RawGitHubRepo {
  id: number;
  name: string;
  full_name?: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics?: string[];
  created_at?: string;
  updated_at?: string;
  private: boolean;
  fork: boolean;
}

interface RawGitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
}



function getCredentials() {
  const username = process.env.NEXT_PUBLIC_GITHUB_USERNAME || "";
  const token = process.env.GITHUB_API_TOKEN || "";

  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
  };

  if (token && token.trim().length > 0) {
    headers.Authorization = `Bearer ${token.trim()}`;
  }

  return { username, headers };
}

export async function fetchGitHubStats(): Promise<GitHubStatsData | null> {
  const { username, headers } = getCredentials();

  try {
    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}`, {
        headers,
        next: { revalidate: 3600 },
      }),
      fetch(`https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`, {
        headers,
        next: { revalidate: 3600 },
      }),
    ]);

    if (!userRes.ok) {
      console.warn(`GitHub API user fetch returned status ${userRes.status}`);
      return null;
    }

    const userData: RawGitHubUser = await userRes.json();
    const reposData: RawGitHubRepo[] = reposRes.ok ? await reposRes.json() : [];

    const totalStars = reposData.reduce((acc, r) => acc + (r.stargazers_count || 0), 0);
    const totalForks = reposData.reduce((acc, r) => acc + (r.forks_count || 0), 0);

    const languagesMap: Record<string, number> = {};
    reposData.forEach((r) => {
      if (r.language) {
        languagesMap[r.language] = (languagesMap[r.language] || 0) + 1;
      }
    });

    const topLanguages = Object.entries(languagesMap)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({
        name,
        count,
        percent: Math.round((count / (reposData.length || 1)) * 100),
      }));

    return {
      publicRepos: userData.public_repos || reposData.length,
      totalStars,
      totalForks,
      followers: userData.followers || 0,
      following: userData.following || 0,
      topLanguages,
      username: userData.login || username,
      avatarUrl: userData.avatar_url || "",
      profileUrl: userData.html_url || `https://github.com/${username}`,
    };
  } catch (error) {
    console.error("Error fetching GitHub statistics:", error);
    return null;
  }
}

export async function fetchGitHubRepositories(): Promise<GitHubRepoItem[]> {
  const { username, headers } = getCredentials();

  try {
    const res = await fetch(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
      { headers, cache: "no-store" }
    );

    if (!res.ok) {
      console.warn(`Failed to fetch repositories for ${username} (Status ${res.status})`);
      return [];
    }

    const reposData: RawGitHubRepo[] = await res.json();

    return reposData.map((repo) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name || repo.name,
      description: repo.description,
      html_url: repo.html_url,
      language: repo.language,
      topics: repo.topics || [],
      created_at: repo.created_at || new Date().toISOString(),
      updated_at: repo.updated_at || new Date().toISOString(),
      stargazers_count: repo.stargazers_count || 0,
      forks_count: repo.forks_count || 0,
      private: repo.private || false,
    }));
  } catch (error) {
    console.error("Error fetching GitHub repositories:", error);
    return [];
  }
}

export async function fetchGitHubRepoDetails(repoName: string): Promise<GitHubImportableProject | null> {
  const { username, headers } = getCredentials();

  try {
    const [repoRes, langRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${encodeURIComponent(username)}/${encodeURIComponent(repoName)}`, {
        headers,
        cache: "no-store",
      }),
      fetch(`https://api.github.com/repos/${encodeURIComponent(username)}/${encodeURIComponent(repoName)}/languages`, {
        headers,
        cache: "no-store",
      }),
    ]);

    if (!repoRes.ok) {
      console.warn(`Failed to fetch repo ${repoName} (Status ${repoRes.status})`);
      return null;
    }

    const repo = await repoRes.json();
    const languagesData: Record<string, number> = langRes.ok ? await langRes.json() : {};

    // Build rich list of technologies
    const langNames = Object.keys(languagesData);
    const topics: string[] = repo.topics || [];

    // Combine languages and topics, avoiding duplicates
    const techSet = new Set<string>();
    langNames.forEach((l) => techSet.add(l));
    if (repo.language && !techSet.has(repo.language)) {
      techSet.add(repo.language);
    }
    topics.forEach((t) => {
      // capitalize topic if appropriate
      const formatted = t.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      techSet.add(formatted);
    });

    const technologies = Array.from(techSet).join(", ") || repo.language || "TypeScript, React";
    const year = repo.created_at ? new Date(repo.created_at).getFullYear() : new Date().getFullYear();

    return {
      title: repo.name,
      description: repo.description || `Full-stack application built with ${technologies}.`,
      github_url: repo.html_url || `https://github.com/${username}/${repoName}`,
      technologies,
      year: year >= 1000 ? year : new Date().getFullYear(),
      client: repo.fork ? "Open Source Contribution" : "Personal Project",
      role: "Full-Stack Developer",
      status: "Completed",
    };
  } catch (error) {
    console.error(`Error fetching details for repo ${repoName}:`, error);
    return null;
  }
}
