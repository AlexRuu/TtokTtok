"use client";

import clsx from "clsx";
import { CheckCircle, XCircle } from "lucide-react";

const passwordChecker = [
  {
    label: "At least 8 characters.",
    test: (pw: string) => pw.length >= 8,
  },
  {
    label: "At least 1 uppercase (A-Z).",
    test: (pw: string) => /[A-Z]/.test(pw),
  },
  {
    label: "At least 1 lowercase (a-z).",
    test: (pw: string) => /[a-z]/.test(pw),
  },
  {
    label: "At least 1 number (0-9).",
    test: (pw: string) => /[0-9]/.test(pw),
  },
  {
    label: "At least 1 special character (!@#$%^&*)",
    test: (pw: string) => /[(!@#$%^&*)]/.test(pw),
  },
];

interface PasswordProps {
  password: string;
}

const PasswordTracker: React.FC<PasswordProps> = ({ password }) => {
  const passedCount = passwordChecker.filter((rule) =>
    rule.test(password)
  ).length;
  const total = passwordChecker.length;
  const progressPercent = (passedCount / total) * 100;
  return (
    <div className="mt-2 space-y-3">
      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={clsx(
            "h-full transition-all duration-300",
            progressPercent < 100 ? "bg-yellow-500" : "bg-green-500"
          )}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <div className="text-sm space-y-1">
        {passwordChecker.map((rule) => {
          const passed = rule.test(password);
          return (
            <div
              key={rule.label}
              className={clsx(
                "flex items-center space-x-2",
                passed ? "text-green-600" : "text-gray-400"
              )}
            >
              {passed ? <CheckCircle size={16} /> : <XCircle size={16} />}
              <span>{rule.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PasswordTracker;
