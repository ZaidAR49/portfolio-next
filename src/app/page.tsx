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
    <div>
      <Suspense fallback={<Loading />}>
        <HeroSection user={user} skills={skills} />
      </Suspense>
      <hr className="border-slate-800" />
      <Suspense fallback={<Loading />}>
        <Projects projects={projects} />
      </Suspense>
      <hr className="border-slate-800" />
      <Suspense fallback={<Loading />}>
        <About title={user.about_title} description={user.about_description} />
      </Suspense>
    </div>
  )
}

export default page