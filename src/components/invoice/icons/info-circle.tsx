import type { SVGProps } from "react";

/** Synced from tourfirm/src/shared/assets/icons/info-circle.tsx */
export function InfoCircleIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 14 14"
      width={14}
      height={14}
      fill="none"
      {...props}
    >
      <path
        fill="currentColor"
        d="M6.667 0C2.993 0 0 2.993 0 6.667c0 3.673 2.993 6.666 6.667 6.666 3.673 0 6.666-2.993 6.666-6.666C13.333 2.993 10.34 0 6.667 0Zm-.5 4c0-.273.226-.5.5-.5.273 0 .5.227.5.5v3.333c0 .274-.227.5-.5.5a.504.504 0 0 1-.5-.5V4ZM7.28 9.587a.688.688 0 0 1-.14.22.77.77 0 0 1-.22.14.664.664 0 0 1-.253.053.664.664 0 0 1-.254-.053.77.77 0 0 1-.22-.14.688.688 0 0 1-.14-.22A.664.664 0 0 1 6 9.333c0-.086.02-.173.053-.253a.77.77 0 0 1 .14-.22.77.77 0 0 1 .22-.14.667.667 0 0 1 .507 0 .77.77 0 0 1 .22.14.77.77 0 0 1 .14.22c.033.08.053.167.053.253 0 .087-.02.174-.053.254Z"
      />
    </svg>
  );
}
