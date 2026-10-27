import Link from "next/link";
import { Handshake, Check } from "lucide-react";

type LogoProps = {
  href?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
};

export function Logo({ href = "/", showText = true, size = "md" }: LogoProps) {
  const iconSize = {
    sm: "h-10 w-10 rounded-2xl",
    md: "h-11 w-11 rounded-2xl",
    lg: "h-16 w-16 rounded-[1.4rem]",
  }[size];

  const textSize = {
    sm: "text-xl",
    md: "text-2xl",
    lg: "text-4xl",
  }[size];

  const content = (
    <div className="flex items-center gap-3">
      <div
        className={`relative flex ${iconSize} items-center justify-center overflow-hidden bg-gradient-to-br from-[#ff9a2e] via-[#ff6a00] to-[#ff3d00] text-white shadow-lg shadow-orange-200`}
      >
        <div className="absolute -right-5 -top-5 h-12 w-12 rounded-full bg-white/20" />
        <div className="absolute -bottom-6 -left-6 h-14 w-14 rounded-full bg-black/10" />

        <Handshake
          size={size === "lg" ? 36 : 27}
          strokeWidth={3}
          className="relative z-10"
        />

        <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-[#2ecc71] ring-4 ring-white">
          <Check size={12} strokeWidth={5} />
        </div>
      </div>

      {showText && (
        <div className={`font-black tracking-tight ${textSize}`}>
          ПоРукам
        </div>
      )}
    </div>
  );

  return (
    <Link href={href} className="inline-flex items-center">
      {content}
    </Link>
  );
} 