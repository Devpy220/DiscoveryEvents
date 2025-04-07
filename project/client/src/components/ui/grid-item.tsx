import { cn } from "@/lib/utils";
import React from "react";

interface GridItemProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  rowSpan?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}

export function GridItem({
  children,
  className,
  colSpan = { default: 1 },
  rowSpan = { default: 1 },
}: GridItemProps) {
  const colSpanClasses = [
    colSpan.default && `col-span-${colSpan.default}`,
    colSpan.sm && `sm:col-span-${colSpan.sm}`,
    colSpan.md && `md:col-span-${colSpan.md}`,
    colSpan.lg && `lg:col-span-${colSpan.lg}`,
    colSpan.xl && `xl:col-span-${colSpan.xl}`,
  ].filter(Boolean);

  const rowSpanClasses = [
    rowSpan.default && `row-span-${rowSpan.default}`,
    rowSpan.sm && `sm:row-span-${rowSpan.sm}`,
    rowSpan.md && `md:row-span-${rowSpan.md}`,
    rowSpan.lg && `lg:row-span-${rowSpan.lg}`,
    rowSpan.xl && `xl:row-span-${rowSpan.xl}`,
  ].filter(Boolean);

  return (
    <div
      className={cn(
        colSpanClasses.join(" "),
        rowSpanClasses.join(" "),
        className
      )}
    >
      {children}
    </div>
  );
}
