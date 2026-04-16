import ContactInfo from "@/components/contact-info";
import { Suspense } from "react";
import { ContactForm } from "@/components/forms/contact-form";
import { Loading } from "@/components/loading";
export default function Footer({ isAuthenticated }: { isAuthenticated: boolean }) {


    return (
        <footer id="contact" className="bg-background py-16 px-6 lg:px-24 border-t border-border">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
                <Suspense fallback={<Loading />}>
                    <ContactInfo />
                    <ContactForm isAuthenticated={isAuthenticated} />
                </Suspense>


            </div>
        </footer>
    );
}
