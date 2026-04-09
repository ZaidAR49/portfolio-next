import HeroSection from "@/components/hero";
import { Suspense } from "react";
import { Loading } from "@/components/loading";
import { getActiveUserAction } from "@/actions/user-action";
import { getActiveSkillsAction } from "@/actions/skill-action";
import { getActiveProjectsAction } from "@/actions/project-action";
import Projects from "@/components/projects";
import About from "@/components/about";
const page = async () => {
  const user = await getActiveUserAction();
  const skills = await getActiveSkillsAction();
  const projects = await getActiveProjectsAction();
  return (
    <div className="flex flex-col gap-10 md:gap-24 relative overflow-hidden pb-32">
      {/* Background glow effects */}
      <div className="absolute top-0 inset-x-0 h-[600px] bg-gradient-to-b from-[#38bdf8]/10 via-transparent to-transparent pointer-events-none -z-10 blur-3xl opacity-60" />
      
      <Suspense fallback={<Loading />}>
        <HeroSection user={user} skills={skills} />
      </Suspense>

      <Suspense fallback={<Loading />}>
        <Projects projects={projects} />
      </Suspense>

      <Suspense fallback={<Loading />}>
        <About title={user.about_title} description={user.about_description} />
      </Suspense>
    </div>
  )
}

export default page