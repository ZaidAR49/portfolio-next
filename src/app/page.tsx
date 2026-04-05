
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Hero } from "../components/hero";
import { Projects } from "../components/projects";
import { About } from "../components/about-section";
import { toast } from "react-toastify";
import { Loading } from "../components/loading";
import { logger } from "@/lib/utils/client/logger.helper";
import { getUser, getProjects, getSkills } from "../lib/portfolio-service";
export const Home = () => {

  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [skills, setSkills] = useState<{ main: any[], secondary: any[] }>({ main: [], secondary: [] });
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {

        const [user, projects, skills] = await Promise.all([
          getUser(),
          getProjects(),
          getSkills()

        ]);
        logger.log("fetching data");
        setUser(user);
        setProjects(projects);
        setSkills(skills);

      } catch (error: any) {
        console.error("Error fetching data:", error);
        if (error.response && [401, 404, 500].includes(error.response.status)) {
          router.replace(`/error?status=${error.response.status}&replace=true`);
        }
        else {
          router.replace(`/error?status=1000&replace=true`);
        }
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, []);
  useEffect(() => {
    logger.log("user", user, "skills", skills, "projects", projects);
  }, [user, skills, projects]);




  return (
    <>
      {isLoading ? <Loading /> : (
        <>
          <Hero userInfo={user} skillsData={skills} />
          <Projects projects={projects} />
          <About page="home" userInfo={user} />
        </>
      )}
    </>
  );
};