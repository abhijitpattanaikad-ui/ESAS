export function ComingSoonBadgeMini({ className = "" }) {
  return (
    <svg
      className={className}
      width="42"
      height="12"
      viewBox="0 0 42 12"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: "rotate(12deg)" }}
    >
      <rect
        width="42"
        height="12"
        rx="2"
        fill="#E72940"
        opacity="0.9"
      />
      <text
        x="21"
        y="8.5"
        textAnchor="middle"
        fontSize="7"
        fill="white"
        fontFamily="Inter, sans-serif"
        fontWeight="700"
      >
        COMING SOON
      </text>
    </svg>
  );
}