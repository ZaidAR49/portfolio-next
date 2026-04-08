import HeroSection from "@/components/hero";
import { Suspense } from "react";
import { Loading } from "@/components/loading";
import { getActiveUserAction } from "@/actions/user-action";
import { getSkillsAction } from "@/actions/skill-action";

const page = async () => {
  const user = await getActiveUserAction();
  const skills = await getSkillsAction();
  return (
    <div>
      <Suspense fallback={<Loading />}>
        <HeroSection user={user} skills={skills} />
      </Suspense>
    </div>
  )
}

export default page