import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "TtokTtok Privacy Policy",
};

const PrivacyPage = () => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-gray-800">
      <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center text-pink-600">
        Privacy Policy for TtokTtok
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
        TtokTtok (“we”, “us”, or “our”) is committed to protecting your privacy.
        This Privacy Policy explains how we collect, use, and protect your
        personal information when you use our website, app, and services
        (collectively, the “Platform”).
      </p>
    ),
  },
  {
    title: "1. Information We Collect",
    content: (
      <>
        <p>We collect the following information when you use TtokTtok:</p>
        <p className="font-medium">1.1. Information You Provide</p>
        <ul className="list-disc list-inside ml-4 text-sm space-y-1">
          <li>Email address (when you create an account)</li>
          <li>Content you submit (e.g., comments, quiz answers, notes)</li>
        </ul>
        <p className="font-medium mt-3">Automatically Collected Data</p>
        <ul className="list-disc list-inside ml-4 text-sm space-y-1">
          <li>Usage data, such as pages visited and time spent</li>
          <li>Device and browser information</li>
          <li>IP address (used only for analytics and security)</li>
        </ul>
        <p>
          We do not collect payment information directly — this is handled
          securely by our third-party payment processor if applicable.
        </p>
      </>
    ),
  },
  {
    title: "2. How We Use Your Information",
    content: (
      <>
        <p>We use your data to:</p>
        <ul className="list-disc list-inside ml-4 text-sm space-y-1">
          <li>Provide and maintain the Platform</li>
          <li>Personalize your learning experience</li>
          <li>Analyze user trends to improve content and features</li>
          <li>Respond to user inquiries or support requests</li>
          <li>Send occasional service-related updates</li>
        </ul>
      </>
    ),
  },
  {
    title: "3. Legal Basis for Collection",
    content: (
      <>
        <p>
          We only collect and use your personal data when we have a valid legal
          reason to do so. This includes:
        </p>
        <ul className="list-disc list-inside ml-4 text-sm space-y-1">
          <li>
            When you’ve given us your clear consent (e.g., signing up with your
            email)
          </li>
          <li>
            When we need the information to provide our services (e.g., account
            access or quiz progress)
          </li>
          <li>When we&apos;re required to comply with legal obligations</li>
          <li>
            When it helps us improve TtokTtok in a way that doesn&apos;t
            override your rights
          </li>
        </ul>
      </>
    ),
  },
  {
    title: "4. How We Share Information",
    content: (
      <>
        <p>We do not sell your personal information.</p>
        <p>We may share your data with:</p>
        <ul className="list-disc list-inside ml-4 text-sm space-y-1">
          <li>
            Service providers (e.g., Supabase, analytics, email providers)
          </li>
          <li>Authorities, if required by law or legal request</li>
        </ul>
        <p>
          All third-party services are bound by confidentiality and security
          obligations.
        </p>
      </>
    ),
  },
  {
    title: "5. Cookies",
    content: (
      <p>
        TtokTtok uses cookies or similar technologies to enhance user experience
        and analyze usage data. You can manage cookie settings through your
        browser.
      </p>
    ),
  },
  {
    title: "6. Data Storage and Security",
    content: (
      <p>
        Your data is stored securely on servers managed by trusted
        infrastructure providers (e.g., Supabase or Vercel). We use appropriate
        technical and organizational measures to protect your data from
        unauthorized access, disclosure, or destruction. These providers only
        access data necessary to perform their services and are contractually
        obligated to handle it securely.
      </p>
    ),
  },
  {
    title: "7. Data Retention",
    content: (
      <>
        <p>We retain your personal information for as long as necessary to:</p>
        <ul className="list-disc list-inside ml-4 text-sm space-y-1">
          <li>Provide the service</li>
          <li>Comply with legal obligations</li>
          <li>Resolve disputes</li>
          <li>Enforce our policies</li>
        </ul>
        <p>
          You may request account deletion at any time. Once requested, account
          deletion is typically completed within 30 days.
        </p>
      </>
    ),
  },
  {
    title: "8. Automated Decision-Making",
    content: (
      <p>
        TtokTtok does not use your personal data to make automated decisions
        that significantly affect you, such as profiling or determining
        eligibility for services. All decisions related to your account or
        experience are manual or based on clearly explained user actions (e.g.,
        completing a quiz unlocks progress).
      </p>
    ),
  },
  {
    title: "9. Your Rights",
    content: (
      <>
        <p>As a Canadian resident, you have the right to:</p>
        <ul className="list-disc list-inside ml-4 text-sm space-y-1">
          <li>Access your personal information</li>
          <li>Correct inaccuracies</li>
          <li>Withdraw consent (where applicable)</li>
          <li>Request deletion of your account and data</li>
        </ul>
        <p>
          To exercise any of these rights, contact us at:{" "}
          <Link
            href="mailto:ttokttoktteok@gmail.com"
            className="text-blue-600 underline hover:text-blue-500"
          >
            ttokttoktteok@gmail.com
          </Link>
        </p>
      </>
    ),
  },
  {
    title: "10. Children's Privacy",
    content: (
      <p>
        The Platform is not intended for children under the age of 13. We do not
        knowingly collect personal information from individuals under 13. If we
        become aware that a user under the age of 13 has provided us with
        personal data without verified parental consent, we will take steps to
        delete that information promptly and terminate the account if
        applicable.
      </p>
    ),
  },
  {
    title: "11. International Users",
    content: (
      <p>
        If you access TtokTtok from outside Canada, your information may be
        transferred to, stored, or processed in Canada or other countries where
        our service providers operate.
      </p>
    ),
  },
  {
    title: "12. Changes to This Policy",
    content: (
      <p>
        We may update this Privacy Policy from time to time. We&apos;ll notify
        users of material changes. Continued use of the Platform after updates
        means you accept the revised policy.
      </p>
    ),
  },
  {
    title: "13. Terms of Service",
    content: (
      <p>
        You can also review our{" "}
        <Link
          href="/terms"
          className="text-blue-600 underline hover:text-blue-500"
        >
          Terms of Service
        </Link>
        .
      </p>
    ),
  },
  {
    title: "14. Contact Us",
    content: (
      <p>
        If you have questions about this Privacy Policy or your data, contact:{" "}
        <Link
          href="mailto:ttokttoktteok@gmail.com"
          className="text-blue-600 underline hover:text-blue-500"
        >
          ttokttoktteok@gmail.com
        </Link>
      </p>
    ),
  },
];

export default PrivacyPage;
