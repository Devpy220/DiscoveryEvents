import { ReactNode } from "react";

interface PageBackgroundProps {
  children: ReactNode;
  imagePath?: string;
  overlayOpacity?: string;
}

export default function PageBackground({
  children,
  imagePath = "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?q=80&w=2670&auto=format&fit=crop",
  overlayOpacity = "bg-white/90",
}: PageBackgroundProps) {
  // Lista de imagens de shows/concertos de alta qualidade
  const concertImages = [
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6a3?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1468359601543-843bfaef291a?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=2670&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=2670&auto=format&fit=crop"
  ];
  
  // Usar a imagem fornecida ou uma aleatória da lista se não for fornecida
  const backgroundImage = imagePath || concertImages[Math.floor(Math.random() * concertImages.length)];

  return (
    <div className="min-h-screen relative">
      {/* Imagem de fundo */}
      <div className="fixed inset-0 -z-10">
        <img
          src={backgroundImage}
          alt="Background"
          className="w-full h-full object-cover"
        />
        {/* Overlay gradiente de roxo com preto para melhorar a legibilidade */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/80 to-black/90"></div>
        {/* Overlay adicional para controle fino de opacidade */}
        <div className={`absolute inset-0 ${overlayOpacity}`}></div>
      </div>
      
      {/* Conteúdo */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}