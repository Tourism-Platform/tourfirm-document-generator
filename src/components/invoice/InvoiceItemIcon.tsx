import type { SVGProps } from "react";
import {
  BoxOutlineIcon,
  BusIcon,
  DrivingIcon,
  HouseIcon,
  InfoCircleIcon,
  PlaneIcon,
  TaskSquareIcon,
  TicketStarIcon,
  TrainIcon,
  UsersIcon,
} from "./icons";

interface IInvoiceItemIconProps {
  typ?: string;
}

const ICON_PROPS: SVGProps<SVGSVGElement> = {
  className: "invoice-item-icon",
  width: 14,
  height: 14,
  "aria-hidden": true,
};

export function InvoiceItemIcon({ typ }: IInvoiceItemIconProps) {
  const kind = (typ ?? "").toLowerCase();

  if (kind === "flight") {
    return <PlaneIcon {...ICON_PROPS} />;
  }

  if (kind === "housing") {
    return <HouseIcon {...ICON_PROPS} />;
  }

  if (kind === "transfer") {
    return <DrivingIcon {...ICON_PROPS} />;
  }

  if (kind === "bus") {
    return <BusIcon {...ICON_PROPS} />;
  }

  if (kind === "train") {
    return <TrainIcon {...ICON_PROPS} />;
  }

  if (kind === "activity") {
    return <TicketStarIcon {...ICON_PROPS} />;
  }

  if (kind === "supplementary") {
    return <BoxOutlineIcon {...ICON_PROPS} />;
  }

  if (kind === "guide") {
    return <UsersIcon {...ICON_PROPS} />;
  }

  if (kind === "options" || kind === "package") {
    return <TaskSquareIcon {...ICON_PROPS} />;
  }

  return <InfoCircleIcon {...ICON_PROPS} />;
}
