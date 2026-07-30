"use client";

type ExAnimatedButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  type?: "button" | "submit" | "reset";
  className?: string;
};

export const ExAnimatedButton = ({
                                   children,
                                   onClick,
                                   disabled = false,
                                   size = "md",
                                   type = "button",
                                   className = "",
                                 }: ExAnimatedButtonProps) => {
  // Variants only affect inner text size
  const sizes = {
    sm: "text-[12px]",
    md: "text-[14px]",
    lg: "text-[15px]",
  };
  
  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`
        relative
        inline-flex items-center justify-center
        w-[160px] h-[42px]
        rounded-[12px]
        overflow-hidden
        transition-all duration-300
        ${disabled ? "opacity-60 cursor-not-allowed" : "hover:brightness-[1.08]"}
        ${className}
      `}
    >
      {/* --- HYBRID GLOW ENGINE (background) --- */}
      <div
        className={`
          absolute inset-0
          -z-10
          ${disabled ? "" : "animate-aura-rotate"}
          transition-opacity duration-500
        `}
        style={{
          width: "220%",
          height: "220%",
          top: "-60%",
          left: "-60%",
          borderRadius: "50%",
          transformOrigin: "50% 50%",
          background: `
            radial-gradient(
              circle,
              rgba(255, 109, 141, 0.20) 0%,
              rgba(153, 33, 52, 0.14) 40%,
              rgba(0, 0, 0, 0) 70%
            ),
            conic-gradient(
              from 0deg,
              #ff6d8d,
              #ff355e,
              #9c1b33,
              #ff6d8d
            )
          `,
          opacity: disabled ? 0.5 : 0.85,
          filter: "blur(22px)",
        }}
      ></div>
      
      {/* --- Hover: faster swirl --- */}
      {!disabled && (
        <div
          className="
            absolute inset-0
            -z-10
            opacity-0
            hover:opacity-100
            animate-aura-rotate-fast
            transition-opacity duration-500
          "
          style={{
            width: "220%",
            height: "220%",
            top: "-60%",
            left: "-60%",
            borderRadius: "50%",
            transformOrigin: "50% 50%",
            background: `
              radial-gradient(
                circle,
                rgba(255, 109, 141, 0.26) 0%,
                rgba(153, 33, 52, 0.18) 40%,
                rgba(0, 0, 0, 0) 70%
              ),
              conic-gradient(
                from 0deg,
                #ff7a9a,
                #ff4d6f,
                #b81c3e,
                #ff7a9a
              )
            `,
            filter: "blur(24px)",
          }}
        />
      )}
      
      {/* --- CENTERED LABEL WRAPPER (Your layout preserved) --- */}
      <div
        className={`
          relative z-10
          rounded-[12px]
          bg-[#8B1825]/85
          text-white font-semibold uppercase pt-[2px]
          w-[96%] h-[89%]
          flex items-center justify-center cursor-pointer
          ${sizes[size]}
        `}
        style={{
          letterSpacing: "0.06em",
        }}
      >
        {children}
      </div>
    </button>
  );
};