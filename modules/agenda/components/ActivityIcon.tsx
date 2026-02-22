
import React from "react";
import { 
  Sun, 
  Coffee, 
  Backpack, 
  School, 
  Utensils, 
  Gamepad, 
  Tv, 
  Moon,
  Star,
  Heart,
  Frown,
  Users
} from "lucide-react";
import { MagicIcon } from "../../../core/components/ui/MagicIcon";

interface ActivityIconProps {
  name: string;
  size?: number;
  className?: string;
}

export const ActivityIcon: React.FC<ActivityIconProps> = ({ name, size = 20, className = "" }) => {
  // If it's an emoji (checked via regex or simple length/type check for the given app context)
  if (name && (/\p{Emoji}/u.test(name) || name.length <= 4)) {
    return (
      <span 
        style={{ fontSize: `${size}px`, lineHeight: 1 }} 
        className={`inline-flex items-center justify-center ${className}`}
      >
        {name}
      </span>
    );
  }

  // Fallback map for legacy or specific named icons
  const iconMap: Record<string, any> = {
    "Acordar": Sun,
    "Café da Manhã": Coffee,
    "Entrada da Escola": Backpack,
    "Saída da Escola": School,
    "Almoçar": Utensils,
    "Jogar": Gamepad,
    "Assistir Desenho": Tv,
    "Jantar": Utensils,
    "Dormir": Moon,
    "happy": Heart,
    "sad": Frown,
    "school": School,
    "family": Users,
    "other": Star
  };

  const IconComponent = iconMap[name] || Star;

  return (
    <MagicIcon 
      icon={IconComponent} 
      size={size} 
      className={className} 
      variant="duotone"
      glow={name === 'other' || name === 'happy'}
    />
  );
};
