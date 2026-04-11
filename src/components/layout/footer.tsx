import ContactInfo from "@/components/contact-info";
import { Suspense } from "react";
import { ContactForm } from "@/components/forms/contact-form";
import { Loading } from "@/components/loading";
export default function Footer() {


    return (
        <footer id="contact" className="bg-slate-50 dark:bg-[#0b1121] py-16 px-6 lg:px-24 border-t border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                <Suspense fallback={<Loading />}>
                    <ContactInfo />
                    <ContactForm />
                </Suspense>


            </div>
        </footer>
    );
}
