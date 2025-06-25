import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "TtokTtok Terms of Service",
};

const TermsOfService = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-pink-600">
        Terms of Service for TtokTtok
      </h1>
      <p className="text-sm text-center text-gray-500 mb-12">
        Effective Date: June 18, 2025
      </p>

      <section className="space-y-12">
        {sections.map(({ title, content }, index) => (
          <div
            key={index}
            className="border-b border-gray-200 pb-6 hover:bg-pink-50/10 transition-colors rounded-lg px-2"
          >
            <h2 className="text-xl font-semibold text-pink-500 mb-2">
              {title}
            </h2>
            <div className="space-y-3 leading-relaxed text-[15px] text-gray-700">
              {content}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
};

const sections = [
  {
    title: "Introduction",
    content: (
      <p>
        Welcome to TtokTtok (“we”, “our”, or “us”). These Terms and Conditions
        (“Terms”) govern your use of the TtokTtok app, website, and services. By
        using the Platform, you (“user”, “you”) agree to be bound by these
        Terms. If you do not agree, please refrain from accessing or using our
        platform.
      </p>
    ),
  },
  {
    title: "1. Eligibility",
    content: (
      <p>
        You must be at least 13 years old to use TtokTtok. If you are under the
        age of majority in your jurisdiction, you must have permission from a
        parent or legal guardian.
      </p>
    ),
  },
  {
    title: "2. Use of Platform",
    content: (
      <>
        <p>
          You agree to use the platform only for its intended educational
          purpose: to learn and review the Korean language. You must not:
        </p>
        <ul className="list-disc list-inside mt-1 space-y-1 text-sm">
          <li>Use the platform in any unlawful manner</li>
          <li>
            Reverse-engineer, copy, or distribute the platform&apos;s content
            without permission
          </li>
          <li>Interfere with or disrupt the platform&apos;s functionality</li>
        </ul>
      </>
    ),
  },
  {
    title: "3. User Registration and Accounts",
    content: (
      <p>
        3.1 Creating an account on the Platform is optional and may provide
        additional features and functionality. If you choose to create an
        account, you will be solely responsible for maintaining the
        confidentiality of your account information and all activity associated
        with your account. You agree to notify us immediately of any
        unauthorized use of your account. We are not liable for any loss or
        damage arising from your failure to comply with these requirements.
      </p>
    ),
  },
  {
    title: "4. User-Generated Content",
    content: (
      <>
        <p>
          4.1 This Platform allows users to create and share content, including
          comments and guides.
        </p>
        <p>
          4.2 We may, but are not obligated to, moderate user-generated content.
          We reserve the right to remove or modify any content that violates
          these Terms or is deemed inappropriate, without prior notice.
        </p>
        <p>
          4.3 Users retain ownership of their user-generated content. By sharing
          content on the Platform, you grant us a non-exclusive, royalty-free,
          worldwide license to use, reproduce, modify, and distribute the
          content for the purposes of operating and promoting the Platform.
        </p>
      </>
    ),
  },
  {
    title: "5. Intellectual Property Rights",
    content: (
      <>
        <p>
          All content and data provided on this platform, with the exclusion of
          user-generated content, are property of TtokTtok.
        </p>
        <p>
          We respect the intellectual property rights of others. If you believe
          that any content on this Platform infringes upon your intellectual
          property rights or the rights of others, please contact us
          immediately.
        </p>
      </>
    ),
  },
  {
    title: "6. Data Collection and Privacy",
    content: (
      <>
        <p>
          6.1 We do not collect personal data from users unless explicitly
          provided and necessary for specific features provided by the Platform.
        </p>
        <p>
          6.2 We have a privacy policy that outlines how we handle and protect
          user data. By using the Platform, you agree to the terms of our{" "}
          <Link
            href="/privacy"
            className="text-blue-600 underline hover:text-blue-500"
          >
            Privacy Policy
          </Link>
          .
        </p>
        <p>
          6.3 The Platform may use third-party analytics and advertising
          services, which may collect user data. Please refer to our{" "}
          <Link
            href="/privacy"
            className="text-blue-600 underline hover:text-blue-500"
          >
            Privacy Policy
          </Link>{" "}
          for more information.
        </p>
      </>
    ),
  },
  {
    title: "7. Payments and Subscriptions",
    content: (
      <p>
        TtokTtok may offer optional paid features or subscriptions. All prices
        are in Canadian dollars (CAD). Subscriptions renew automatically unless
        canceled prior to the renewal date. Refunds are not guaranteed and are
        provided at our sole discretion.
      </p>
    ),
  },
  {
    title: "8. Prohibited Activities",
    content: (
      <p>
        You agree not to upload, post, or transmit any content that is illegal,
        infringing, defamatory, harassing, or otherwise objectionable.
      </p>
    ),
  },
  {
    title: "9. Termination",
    content: (
      <p>
        We reserve the right to suspend or terminate your access to the Platform
        at any time for violations of these Terms, or for any reason, without
        notice.
      </p>
    ),
  },
  {
    title: "10. Limitation of Liability",
    content: (
      <>
        <p>
          10.1 Disclaimer: We provide the Platform and its content on an
          &quot;as-is&quot; and &quot;as available&quot; basis. We do not
          warrant the accuracy, reliability, or completeness of any information
          or content provided on the Platform.
        </p>
        <p>
          10.2 We shall not be held liable for any direct, indirect, incidental,
          consequential, or special damages arising out of or in connection with
          the use of the Platform or its content. This includes, but is not
          limited to, damages for loss of profits, data, or other intangible
          losses, even if we have been advised of the possibility of such
          damages.
        </p>
      </>
    ),
  },
  {
    title: "11. Modifications",
    content: (
      <p>
        We reserve the right to modify these Terms at any time. Continued use of
        the Platform after changes constitutes your acceptance of the new Terms.
        We will notify users of material updates.
      </p>
    ),
  },
  {
    title: "12. Contact",
    content: (
      <p>
        For questions about these Terms, contact us at:{" "}
        <Link
          href="mailto:ttokttoktteok@gmail.com"
          className="text-blue-600 underline hover:text-blue-500"
        >
          ttokttoktteok@gmail.com
        </Link>
      </p>
    ),
  },
  {
    title: "13. Governing Law",
    content: (
      <p>
        These Terms shall be governed by and construed in accordance with the
        laws of the Province of Ontario and the laws of Canada applicable
        therein, without regard to its conflict of law principles.
      </p>
    ),
  },
  {
    title: "14. Entire Agreement",
    content: (
      <p>
        These Terms constitute the entire agreement between you and TtokTtok.com
        regarding the use of the Platform and supersede any prior or
        contemporaneous agreements, communications, or understandings, whether
        written or oral.
      </p>
    ),
  },
];

export default TermsOfService;
