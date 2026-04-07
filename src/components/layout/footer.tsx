import ContactInfo from "@/components/contact-info";
import { Suspense } from "react";
import { ContactForm } from "@/components/contact-form";
export default function Footer() {


    return (
        <footer className="bg-[#0b1121] py-16 px-6 lg:px-24 border-t border-slate-800">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                <Suspense fallback={<div>Loading...</div>}>
                    <ContactInfo />
                    <ContactForm />
                </Suspense>


            </div>
        </footer>
    );
}
