import { Mail } from "lucide-react";
import React from "react";

const ContactInformation = () => {
  return (
    <div className="w-full md:w-1/2 h-full space-y-6">
      <h1 className="text-4xl font-semibold md:text-start text-center">
        Contact Us
      </h1>
      <p className="text-base leading-relaxed md:text-start text-center">
        Have any questions, comments, or concerns? Feel free to reach out to us
        — we&apos;re happy to help!
        <br />
        You can fill out the form, or email us directly. We&apos;ll do our best
        to get back to you as soon as possible.
      </p>
      <p className="text-base leading-relaxed md:text-start text-center">
        질문, 의견, 또는 문의사항이 있으신가요? 언제든지 편하게 연락 주세요 —
        기꺼이 도와드릴게요!
        <br />
        양식을 작성하시거나 이메일로 보내주셔도 좋습니다. 최대한 빠르게
        답변드리도록 하겠습니다.
      </p>
      <div className="flex items-center space-x-4 pt-2 md:justify-start justify-center">
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
