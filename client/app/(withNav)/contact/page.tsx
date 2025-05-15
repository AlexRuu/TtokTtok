import React from "react";
import ContactForm from "./component/contact-form";
import { Metadata } from "next";
import ContactInformation from "./component/contact-information";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Ttok Ttok",
};

const ContactPage = () => {
  return (
    <div className="mt-10 mx-4 flex flex-col md:flex-row items-stretch min-h-screen bg-[#FFF9F5] text-[#6B4C3B] md:space-x-8 space-y-8 md:space-y-0 px-6 md:px-12 py-16 rounded-2xl shadow-xl">
      <ContactInformation />
      <ContactForm />
    </div>
  );
};

export default ContactPage;
