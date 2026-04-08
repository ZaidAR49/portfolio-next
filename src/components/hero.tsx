"use client";
import Link from 'next/link'
import Image from 'next/image'
import { User } from '@/lib/models/user';
import { Skill } from '@/lib/models/skill';
import Marquee from "react-fast-marquee";
import { getIconForTechnology } from '@/lib/utils/client/icon-mapper';

export default function HeroSection({ user, skills }: { user: User, skills: Skill[] }) {

    const skillsSlider = () => {
        return (
            <Marquee gradient={false} speed={50}>
                {skills.map((skill, index) => (
                    <div key={index} className="skill-item">
                        <span className="skill-icon">
                            {getIconForTechnology(skill.name)}
                        </span>
                        <span className="skill-name">{skill.name}</span>
                    </div>
                ))}
            </Marquee>
        )
    }

    return (
        <section className='flex flex-col '>
            <div className="hero-section">
                {/* Left content */}
                <div className="hero-content">
                    <span className="hero-badge">{user.job_title}</span>

                    <h1 className="hero-name">
                        <span className="hero-greeting">Hi , I'm</span>
                        <br />
                        <span className="hero-firstname">{user.name} </span>
                    </h1>

                    <p className="hero-bio">{user.hero_description}</p>

                    <div className="hero-actions">
                        <Link href={user.resume_url} className="hero-btn-primary">
                            Download CV
                        </Link>
                        <Link href={user.linkedin_url} className="hero-btn-secondary">
                            Contact Me
                        </Link>
                    </div>
                </div>

                {/* Right — profile card */}
                <div className="hero-profile-wrap">
                    <div className="hero-profile-card">
                        <div className="hero-profile-img-wrap">
                            {

                                user.picture_url && (
                                    <Image
                                        src={"https://res.cloudinary.com/dxa0aylow/image/upload/v1769416147/qentbmtdh7xeslqkcs3a.png"}
                                        alt={user.name}
                                        fill
                                        sizes="(max-width: 768px) 260px, 340px"
                                        className="hero-profile-img"
                                        priority
                                        unoptimized
                                    />
                                )
                            }
                        </div>
                        <div className="hero-profile-label">{user.job_title}</div>
                    </div>
                </div>
            </div>
            {skillsSlider()}

        </section>
    )
}