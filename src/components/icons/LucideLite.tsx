import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & {
  size?: number | string;
};

function BaseIcon({
  size = 20,
  className,
  children,
  ...rest
}: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...rest}
    >
      {children}
    </svg>
  );
}

export function ChevronLeft(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m15 18-6-6 6-6" />
    </BaseIcon>
  );
}

export function RotateCcw(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 3v4h4" />
    </BaseIcon>
  );
}

export function Trophy(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M8 21h8" />
      <path d="M12 17v4" />
      <path d="M7 4h10v4a5 5 0 0 1-10 0z" />
      <path d="M5 6H3a2 2 0 0 0 2 2" />
      <path d="M19 6h2a2 2 0 0 1-2 2" />
    </BaseIcon>
  );
}

export function User(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </BaseIcon>
  );
}

export function Bot(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <rect x="5" y="8" width="14" height="10" rx="2" />
      <path d="M12 4v4" />
      <circle cx="9" cy="13" r="1" />
      <circle cx="15" cy="13" r="1" />
    </BaseIcon>
  );
}

export function Volume2(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M11 5 6 9H3v6h3l5 4z" />
      <path d="M15 9a5 5 0 0 1 0 6" />
      <path d="M18.5 7a8 8 0 0 1 0 10" />
    </BaseIcon>
  );
}

export function VolumeX(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M11 5 6 9H3v6h3l5 4z" />
      <path d="m17 9 4 6" />
      <path d="m21 9-4 6" />
    </BaseIcon>
  );
}

export function Flag(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M4 22V4" />
      <path d="M4 4h12l-2 4 2 4H4" />
    </BaseIcon>
  );
}

export function SkipForward(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m5 4 10 8-10 8z" />
      <path d="M19 5v14" />
    </BaseIcon>
  );
}

export function Crown(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="m3 8 4 3 5-6 5 6 4-3-2 10H5z" />
    </BaseIcon>
  );
}

export function Users(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="10" r="2.5" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="M14 20a4 4 0 0 1 7 0" />
    </BaseIcon>
  );
}

export function Lightbulb(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12c.8.7 1.3 1.5 1.5 2.5h5c.2-1 .7-1.8 1.5-2.5A7 7 0 0 0 12 2z" />
    </BaseIcon>
  );
}

export function Undo2(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <path d="M9 14 4 9l5-5" />
      <path d="M20 20a8 8 0 0 0-8-8H4" />
    </BaseIcon>
  );
}

export function Settings(props: IconProps) {
  return (
    <BaseIcon {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a1 1 0 0 1 0 1.4l-1.3 1.3a1 1 0 0 1-1.4 0l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V21a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-.2a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a1 1 0 0 1-1.4 0L4.3 18a1 1 0 0 1 0-1.4l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H3a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h.2a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a1 1 0 0 1 0-1.4L5.1 4a1 1 0 0 1 1.4 0l.1.1a1 1 0 0 0 1.1.2H8a1 1 0 0 0 .6-.9V3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v.2a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a1 1 0 0 1 1.4 0l1.3 1.3a1 1 0 0 1 0 1.4l-.1.1a1 1 0 0 0-.2 1.1V8a1 1 0 0 0 .9.6H21a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-.2a1 1 0 0 0-.9.6z" />
    </BaseIcon>
  );
}
