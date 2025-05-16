import React from "react";
import { Metadata } from "next";
import BaseContact from "./component/base";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Ttok Ttok",
};

const ContactPage = () => {
  return <BaseContact />;
};

export default ContactPage;
