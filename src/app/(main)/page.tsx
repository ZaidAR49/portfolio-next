import HeroSection from "@/components/hero";
import { getActiveUserAction } from "@/actions/user-action";
import { getActiveSkillsAction } from "@/actions/skill-action";
import { getActiveProjectsAction } from "@/actions/project-action";
import { getActiveCategoriesAction } from "@/actions/category-action";
import Projects from "@/components/projects";
import About from "@/components/about";
import SkillsSection from "@/components/skills-section";

const page = async () => {
  const [user, skills, projects, projectCategories, skillCategories] = await Promise.all([
    getActiveUserAction(),
    getActiveSkillsAction(),
    getActiveProjectsAction(),
    getActiveCategoriesAction("project"),
    getActiveCategoriesAction("skill"),
  ]);

  return (
    <div className="flex flex-col gap-10 md:gap-24 relative overflow-hidden pb-32">
      {/* Background glow effects */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-[#38bdf8]/10 via-transparent to-transparent pointer-events-none -z-10 blur-3xl opacity-60" />

      <HeroSection user={user} skills={skills} />
      <SkillsSection skills={skills} categories={skillCategories} />
      <Projects projects={projects} categories={projectCategories} />
      <About title={user.about_title} description={user.about_description} />
    </div>
  );
};

export default page;
