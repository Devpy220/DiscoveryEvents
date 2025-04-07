import { useLocation } from "wouter";
import { Category } from "@shared/schema";
import { 
  Music, 
  ActivitySquare, 
  Film, 
  Mic2, 
  Theater, 
  MoreHorizontal 
} from "lucide-react";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  const [, navigate] = useLocation();
  
  // Function to render the appropriate icon based on category name
  const renderIcon = () => {
    const iconProps = { className: "h-8 w-8" };
    
    switch (category.icon) {
      case "Music":
        return <Music {...iconProps} />;
      case "ActivitySquare":
        return <ActivitySquare {...iconProps} />;
      case "Film":
        return <Film {...iconProps} />;
      case "Mic2":
        return <Mic2 {...iconProps} />;
      case "Theater":
        return <Theater {...iconProps} />;
      case "MoreHorizontal":
        return <MoreHorizontal {...iconProps} />;
      default:
        return <MoreHorizontal {...iconProps} />;
    }
  };
  
  // Function to determine the background and text color based on the category color
  const getColorStyles = () => {
    const colorMap: Record<string, { bg: string, text: string }> = {
      primary: { bg: "bg-primary/10", text: "text-primary" },
      secondary: { bg: "bg-secondary/10", text: "text-secondary" },
      accent: { bg: "bg-accent/10", text: "text-accent" },
      success: { bg: "bg-success/10", text: "text-success" },
      warning: { bg: "bg-warning/10", text: "text-warning" },
      gray: { bg: "bg-gray-200", text: "text-gray-600" }
    };
    
    return colorMap[category.color] || { bg: "bg-gray-200", text: "text-gray-600" };
  };
  
  const { bg, text } = getColorStyles();
  const hoverClasses = `group-hover:bg-${category.color} group-hover:text-white`;

  return (
    <a 
      className="flex flex-col items-center p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition group cursor-pointer"
      onClick={() => navigate(`/events?category=${category.id}`)}
    >
      <div className={`w-16 h-16 flex items-center justify-center rounded-full ${bg} ${text} mb-3 transition-all ${hoverClasses}`}>
        {renderIcon()}
      </div>
      <span className="font-medium text-gray-900 dark:text-white">{category.name}</span>
      <span className="text-sm text-gray-500 dark:text-gray-400">{category.eventCount} eventos</span>
    </a>
  );
}
