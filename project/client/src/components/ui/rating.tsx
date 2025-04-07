import { useState } from "react";
import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface RatingProps {
  defaultValue?: number;
  max?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  className?: string;
  starClassName?: string;
}

export function Rating({
  defaultValue = 0,
  max = 5,
  onChange,
  readOnly = false,
  className,
  starClassName,
}: RatingProps) {
  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const [selectedValue, setSelectedValue] = useState<number>(defaultValue);
  
  const handleStarClick = (value: number) => {
    if (readOnly) return;
    
    setSelectedValue(value);
    onChange?.(value);
  };
  
  const handleStarMouseEnter = (value: number) => {
    if (readOnly) return;
    
    setHoveredValue(value);
  };
  
  const handleStarMouseLeave = () => {
    if (readOnly) return;
    
    setHoveredValue(null);
  };
  
  const getStarFill = (value: number) => {
    const activeValue = hoveredValue ?? selectedValue;
    
    if (value <= activeValue) {
      return "fill-current text-primary";
    }
    
    return "fill-none stroke-current text-gray-300";
  };
  
  return (
    <div className={cn("flex", className)}>
      {Array.from({ length: max }).map((_, index) => {
        const value = index + 1;
        return (
          <button
            key={value}
            type="button"
            onClick={() => handleStarClick(value)}
            onMouseEnter={() => handleStarMouseEnter(value)}
            onMouseLeave={handleStarMouseLeave}
            className={cn(
              "p-0.5 transition-colors",
              readOnly ? "cursor-default" : "cursor-pointer",
              starClassName
            )}
            disabled={readOnly}
          >
            <Star
              className={cn(
                "h-5 w-5 transition-colors",
                getStarFill(value)
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
