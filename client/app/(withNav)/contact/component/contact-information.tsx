import { Mail } from "lucide-react";
import React from "react";

const ContactInformation = () => {
  return (
    <div>
      <h1 className="text-3xl">Contact Us</h1>
      <p>
        Have any questions or concerns? Please feel free to reach out to us!
      </p>
      <p>
        You can either fill out the form provided, or send us an email directly,
        and we will do our best to get back to you as soon as possible!
      </p>
      <p>궁금한 점이나 문의 사항이 있으시면 언제든지 편하게 연락 주세요!</p>
      <p>
        양식을 작성하시거나 이메일을 보내주시면, 최대한 빠르게 답변드릴게요.
      </p>
      <div className="flex">
        <Mail /> <span className="pl-5">ttokttok@gmail.com</span>
      </div>
    </div>
  );
};

export default ContactInformation;
