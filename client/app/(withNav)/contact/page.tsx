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
    <div className="flex w-full">
      <ContactInformation />
      <ContactForm />
    </div>
  );
};

export default ContactPage;
