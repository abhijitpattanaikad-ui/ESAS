// src/app/(components)/ui/buttons/ExButton.tsx
"use client";
import React from "react";

import { ExAnimatedButton } from "./ExAnimatedButton";
import { ExClassicButton } from "./ExClassicButton";

type ExButtonProps = {
  children: React.ReactNode;
  variant?: "animated" | "classic";
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
};

export const ExButton = ({ children, variant = "animated", onClick, type = "button" }: ExButtonProps) => {
  if (variant === "classic") {
    return <ExClassicButton onClick={onClick} type={type}>{children}</ExClassicButton>;
  }
  
  return <ExAnimatedButton onClick={onClick} type={type}>{children}</ExAnimatedButton>;
};