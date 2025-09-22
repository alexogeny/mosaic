import { type PropsWithChildren } from "react";
import { Dialog, type DialogProps } from "./Dialog";

export interface SheetProps extends Omit<DialogProps, "variant">, PropsWithChildren {
  side?: "left" | "right" | "bottom";
}

export const Sheet = ({ side = "right", size = "lg", ...props }: SheetProps) => {
  return <Dialog variant="sheet" side={side} size={size} {...props} />;
};
