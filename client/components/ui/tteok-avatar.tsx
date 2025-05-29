interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  color?: string;
}

export default function ProfileAvatar({
  size = 24,
  color = "currentColor",
  ...props
}: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Card background */}
      <rect
        x="2"
        y="4"
        width="20"
        height="16"
        rx="2"
        ry="2"
        fill="#FAF3F0"
        stroke="#A65A3A"
      />
      {/* Profile circle */}
      <circle cx="8" cy="10" r="2" fill="#D69E78" stroke="#B75F45" />
      {/* Text lines */}
      <line x1="14" y1="8" x2="18" y2="8" stroke="#B75F45" />
      <line x1="14" y1="12" x2="18" y2="12" stroke="#B75F45" />
      <line x1="8" y1="16" x2="16" y2="16" stroke="#B75F45" />
    </svg>
  );
}
