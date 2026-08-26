import Link from "next/link";
import type { ReactNode } from "react";

type CommonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "inverse" | "inverse-outline";
  size?: "sm" | "md";
  className?: string;
};

type ButtonAsLink = CommonProps & {
  href: string;
  type?: never;
};

type ButtonAsButton = CommonProps & {
  href?: never;
  type?: "button" | "submit";
  onClick?: () => void;
};

type ButtonProps = ButtonAsLink | ButtonAsButton;

const base =
  "inline-flex cursor-pointer items-center justify-center gap-2 rounded-full font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rust-500 focus-visible:ring-offset-2 focus-visible:ring-offset-beige-50";

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-sm sm:text-base",
};

const variants = {
  primary: "bg-charcoal-700 text-beige-50 hover:bg-rust-500",
  secondary:
    "bg-transparent text-charcoal-700 border border-charcoal-700/30 hover:border-charcoal-700 hover:bg-charcoal-700 hover:text-beige-50",
  ghost: "bg-transparent text-charcoal-700 hover:text-rust-500",
  inverse: "bg-beige-50 text-charcoal-800 hover:bg-rust-500 hover:text-beige-50",
  "inverse-outline":
    "bg-beige-50/10 text-beige-50 border border-beige-50/40 backdrop-blur-sm hover:bg-beige-50 hover:text-charcoal-800",
};

export default function Button(props: ButtonProps) {
  const {
    children,
    variant = "primary",
    size = "md",
    className = "",
  } = props;
  const classes = `${base} ${sizes[size]} ${variants[variant]} ${className}`;

  if ("href" in props && props.href) {
    return (
      <Link href={props.href} className={classes}>
        {children}
      </Link>
    );
  }

  const { type = "button", onClick } = props as ButtonAsButton;
  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
