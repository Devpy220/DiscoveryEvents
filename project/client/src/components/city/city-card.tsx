import { useLocation } from "wouter";
import { City } from "@shared/schema";

interface CityCardProps {
  city: City;
}

export default function CityCard({ city }: CityCardProps) {
  const [, navigate] = useLocation();
  
  return (
    <a 
      className="relative h-48 rounded-lg overflow-hidden group cursor-pointer"
      onClick={() => navigate(`/events?cityId=${city.id}`)}
    >
      <img 
        src={city.image} 
        alt={city.name} 
        className="w-full h-full object-cover object-center group-hover:scale-110 transition duration-500" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4">
        <div>
          <h3 className="text-xl font-bold text-white">{city.name}</h3>
          <p className="text-white/80 text-sm">{city.eventCount} eventos</p>
        </div>
      </div>
    </a>
  );
}
