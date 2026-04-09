import Link from "next/link";

const About = ({ title, description }: { title?: string, description?: string }) => {
    return (
        <section className="py-24 px-4 md:px-8 lg:px-12 max-w-[1200px] mx-auto w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-start">
                <div className="flex flex-col">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium text-slate-100 mb-6">About</h2>
                </div>

                <div className="flex flex-col gap-6">
                    <p className="text-[#f1f5f9] text-xl leading-relaxed ">
                        {title}
                    </p>
                    <p className="text-slate-400 text-sm md:text-base leading-relaxed line-clamp-5">
                        {description}
                    </p>

                    <div className="mt-2">
                        <Link
                            href="/"
                            className="inline-block bg-[#38bdf8] text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-colors hover:bg-sky-400"
                        >
                            More about me
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About