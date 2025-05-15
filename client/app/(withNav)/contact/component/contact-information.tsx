import { Mail } from "lucide-react";
import React from "react";

const ContactInformation = () => {
  return (
    <div className="w-full md:w-1/2 h-full space-y-6">
      <h1 className="text-4xl font-semibold">Contact Us</h1>
      <p className="text-base leading-relaxed">
        Have any questions or concerns? Please feel free to reach out to us!
        <br />
        You can either fill out the form provided, or send us an email directly,
        and we will do our best to get back to you as soon as possible!
      </p>
      <p className="text-base leading-relaxed">
        궁금한 점이나 문의 사항이 있으시면 언제든지 편하게 연락 주세요!
        <br />
        양식을 작성하시거나 이메일을 보내주시면, 최대한 빠르게 답변드릴게요.
      </p>
      <div className="flex items-center space-x-4 pt-2">
        <Mail className="w-5 h-5" />
        <span className="text-sm font-medium">
          <a
            href="mailto:ttokttok@gmail.com"
            className="text-[#8AA4C1] hover:text-[#8E77A6]"
          >
            ttokttok@gmail.com
          </a>
        </span>
      </div>
    </div>
  );
};

export default ContactInformation;
