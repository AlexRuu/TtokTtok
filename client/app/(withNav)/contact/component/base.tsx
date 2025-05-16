"use client";

import React, { useState } from "react";
import ContactInformation from "./contact-information";
import ContactForm from "./contact-form";
import SubmittedContact from "./submitted";

const BaseContact = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="mt-10 mx-4 flex flex-col md:flex-row items-stretch min-h-screen bg-[#FFF9F5] text-[#6B4C3B] md:space-x-8 space-y-8 md:space-y-0 px-6 md:px-12 py-16 rounded-2xl shadow-xl">
      {submitted ? (
        <>
          <SubmittedContact setSubmitted={setSubmitted} />
        </>
      ) : (
        <>
          <ContactInformation />
          <ContactForm setSubmitted={setSubmitted} />
        </>
      )}
    </div>
  );
};

export default BaseContact;
