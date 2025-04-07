import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Verificar o tamanho da tela durante a montagem do componente
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Inicializar
    checkMobile();
    
    // Adicionar listener para mudanças de tamanho
    window.addEventListener('resize', checkMobile);
    
    // Limpar listener na desmontagem
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile;
}