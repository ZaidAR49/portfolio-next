"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  FiGithub,
  FiSearch,
  FiStar,
  FiGitBranch,
  FiCalendar,
  FiX,
  FiRefreshCw,
  FiArrowRight,
  FiCode,
} from "react-icons/fi";
import { getGitHubRepositoriesAction, getGitHubRepoDetailsAction } from "@/actions/github-action";
import { GitHubRepoItem } from "@/lib/services/github-service";

interface GitHubImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GitHubImportModal({ isOpen, onClose }: GitHubImportModalProps) {
  const router = useRouter();
  const [repositories, setRepositories] = useState<GitHubRepoItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [importingRepoId, setImportingRepoId] = useState<number | null>(null);

  // Fetch repositories when modal opens
  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setSearchQuery("");
      getGitHubRepositoriesAction()
        .then((data) => {
          setRepositories(data || []);
        })
        .catch((err) => {
          console.error("Failed to load GitHub repositories:", err);
          toast.error("Failed to load repositories from GitHub");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isOpen]);

  // Real-time filtered list based on search query
  const filteredRepos = useMemo(() => {
    if (!searchQuery.trim()) return repositories;
    const q = searchQuery.toLowerCase().trim();
    return repositories.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q)) ||
        (r.language && r.language.toLowerCase().includes(q)) ||
        (r.topics && r.topics.some((t) => t.toLowerCase().includes(q)))
    );
  }, [repositories, searchQuery]);

  if (!isOpen) return null;

  const handleSelectRepo = async (repo: GitHubRepoItem) => {
    setImportingRepoId(repo.id);
    try {
      const details = await getGitHubRepoDetailsAction(repo.name);
      if (!details) {
        toast.error(`Could not fetch details for "${repo.name}"`);
        return;
      }

      // Save to sessionStorage for project form to consume
      if (typeof window !== "undefined") {
        sessionStorage.setItem("github_imported_project", JSON.stringify(details));
      }

      toast.success(`Loaded "${details.title}" from GitHub!`);
      onClose();

      // Navigate to Add New Project form
      router.push("?tab=projects&action=new");
    } catch (err) {
      console.error("Error importing repository:", err);
      toast.error("Failed to import repository data");
    } finally {
      setImportingRepoId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-surface border border-border rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between bg-surface/80 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
              <FiGithub className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Import from GitHub</h3>
              <p className="text-xs text-muted">
                Select any repository to pre-fill the New Project form
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-muted hover:text-foreground hover:bg-elevated transition-colors"
            title="Close"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar Input */}
        <div className="p-4 sm:p-6 border-b border-border bg-surface/40">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-muted w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search repositories by name, language, or topic..."
              className="w-full bg-elevated border border-border text-foreground rounded-xl pl-11 pr-10 py-2.5 text-sm focus:outline-none focus:border-primary transition placeholder:text-muted"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-foreground p-1"
                title="Clear"
              >
                <FiX className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center justify-between text-[11px] text-muted font-medium mt-2.5 px-1">
            <span>
              {filteredRepos.length} {filteredRepos.length === 1 ? "repository" : "repositories"} found
            </span>
            {searchQuery && (
              <span className="text-primary">Filtered by &quot;{searchQuery}&quot;</span>
            )}
          </div>
        </div>

        {/* Repositories Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {isLoading ? (
            <div className="py-16 text-center text-muted">
              <FiRefreshCw className="w-7 h-7 animate-spin mx-auto mb-3 text-primary" />
              <p className="text-sm font-medium">Fetching repositories from GitHub...</p>
            </div>
          ) : filteredRepos.length === 0 ? (
            <div className="py-12 text-center text-muted bg-elevated/40 rounded-2xl border border-border p-6">
              <FiGithub className="w-8 h-8 mx-auto mb-2 text-muted/60" />
              <p className="text-sm font-semibold text-foreground">No repositories found</p>
              <p className="text-xs text-muted mt-1">
                {searchQuery
                  ? `No repository matches "${searchQuery}". Try a different keyword.`
                  : "No repositories available on this GitHub account."}
              </p>
            </div>
          ) : (
            filteredRepos.map((repo) => {
              const isImporting = importingRepoId === repo.id;
              const formattedDate = new Date(repo.created_at).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              });

              return (
                <div
                  key={repo.id}
                  onClick={() => !isImporting && handleSelectRepo(repo)}
                  className={`group relative p-4 rounded-2xl border border-border bg-surface hover:bg-elevated/80 hover:border-primary/40 transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isImporting ? "opacity-70 pointer-events-none border-primary ring-1 ring-primary/30" : ""
                  }`}
                >
                  <div className="space-y-1.5 flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors truncate">
                        {repo.name}
                      </h4>
                      {repo.private && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-muted/10 text-muted border border-border font-mono">
                          Private
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-muted line-clamp-2 font-light leading-relaxed">
                      {repo.description || "No description provided."}
                    </p>

                    {/* Metadata tags */}
                    <div className="flex items-center gap-3 text-[11px] text-muted pt-1 flex-wrap">
                      {repo.language && (
                        <span className="inline-flex items-center gap-1 text-primary font-medium">
                          <FiCode className="w-3 h-3" />
                          {repo.language}
                        </span>
                      )}

                      {repo.stargazers_count > 0 && (
                        <span className="inline-flex items-center gap-1 text-amber-500 font-mono">
                          <FiStar className="w-3 h-3" />
                          {repo.stargazers_count}
                        </span>
                      )}

                      {repo.forks_count > 0 && (
                        <span className="inline-flex items-center gap-1 text-purple-400 font-mono">
                          <FiGitBranch className="w-3 h-3" />
                          {repo.forks_count}
                        </span>
                      )}

                      <span className="inline-flex items-center gap-1">
                        <FiCalendar className="w-3 h-3" />
                        Created {formattedDate}
                      </span>
                    </div>
                  </div>

                  {/* Import action button */}
                  <div className="flex-shrink-0 flex items-center justify-end">
                    <button
                      type="button"
                      disabled={isImporting}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 group-hover:bg-primary group-hover:text-inverse transition-all duration-200 shadow-sm"
                    >
                      {isImporting ? (
                        <>
                          <FiRefreshCw className="w-3 h-3 animate-spin" />
                          <span>Importing...</span>
                        </>
                      ) : (
                        <>
                          <span>Select</span>
                          <FiArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex items-center justify-between bg-surface/80 text-xs text-muted">
          <span>Clicking a repository auto-fills title, description, URL, and technologies.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-full bg-elevated hover:bg-border text-foreground font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
