import { FaGithub, FaLinkedin } from "react-icons/fa";
import { User } from "@/lib/models/user";
import { getActiveUser } from "@/lib/services/user-service";
const ContactInfo = async () => {
    let user: User | null = null;
    try {
        const res = await getActiveUser();
        user = res;
        console.log(user);
    } catch (error) {
        console.error(error);
    }
    return (
        <div>
            {user && (
                <div className="flex flex-col justify-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 mb-6">
                        Let&apos;s Connect
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-6 max-w-sm">
                        Have a project in mind or just want to say hello?<br />
                        Email me at{" "}
                        <a href={`mailto:${user.email}`} className="text-[#0ea5e9] dark:text-sky-400 hover:underline">
                            {user.email}
                        </a>{" "}
                        or check out my{" "}
                        <a href={user.resume_url} className="text-[#0ea5e9] dark:text-sky-400 hover:underline">
                            resume
                        </a>.
                    </p>

                    <div className="mt-8">
                        <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-6 max-w-sm">
                            Socials
                        </p>
                        {user && (
                            <div className="flex items-center gap-5">
                                <a href={user.github_url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-300 transition-colors duration-200">
                                    <FaGithub className="text-4xl" />
                                </a>
                                <a href={user.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-[#0a66c2] dark:hover:text-slate-300 transition-colors duration-200">
                                    <FaLinkedin className="text-4xl" />
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default ContactInfo