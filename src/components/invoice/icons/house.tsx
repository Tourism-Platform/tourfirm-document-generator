import type { SVGProps } from "react";

/** Synced from tourfirm/src/shared/assets/icons/house.tsx */
export function HouseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 14 13"
      fill="none"
      {...props}
    >
      <path
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={1.5}
        d="M4.375 4.23c-.735 0-1.333.597-1.333 1.332v.875c0 .735.598 1.334 1.333 1.334h1.167c.735 0 1.333-.599 1.333-1.334v-.875c0-.735-.598-1.333-1.333-1.333H4.375Zm4.084 0c-.735 0-1.334.597-1.334 1.332v.875c0 .735.599 1.334 1.334 1.334h1.166c.735 0 1.334-.599 1.334-1.334v-.875c0-.735-.6-1.333-1.334-1.333H8.459Zm.75 5.562c0-.899-.727-1.625-1.625-1.625H6.417c-.899 0-1.625.726-1.625 1.625v1.73H2.47v-.123l.03-6.58v-.003c0-.125.057-.244.159-.323v-.001l4.084-3.173.005-.004a.407.407 0 0 1 .504 0l.005.004.783.607.202.158h2.08l.012 1.262.003.363.285.222.717.56.002.002c.1.077.159.196.159.329v6.7H9.209v-1.73Z"
      />
    </svg>
  );
}
