import { Link } from "wouter";
import { FaInstagram, FaTwitter, FaFacebook, FaYoutube } from "react-icons/fa";
import { Sparkles } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and description */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                Discovery Events
              </span>
            </div>
            <p className="text-gray-600 mb-4">
              A sua plataforma para descobrir, comprar e vender ingressos para os melhores eventos.
            </p>
            <div className="flex space-x-4">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors">
                <FaYoutube size={20} />
              </a>
            </div>
          </div>
          
          {/* Links columns */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Para você</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/events">
                  <span className="text-gray-600 hover:text-primary transition-colors cursor-pointer">Encontrar eventos</span>
                </Link>
              </li>
              <li>
                <Link href="/create-listing">
                  <span className="text-gray-600 hover:text-primary transition-colors cursor-pointer">Criar evento</span>
                </Link>
              </li>
              <li>
                <Link href="/help">
                  <span className="text-gray-600 hover:text-primary transition-colors cursor-pointer">Central de ajuda</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Sobre nós</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about">
                  <span className="text-gray-600 hover:text-primary transition-colors cursor-pointer">Quem somos</span>
                </Link>
              </li>
              <li>
                <Link href="/careers">
                  <span className="text-gray-600 hover:text-primary transition-colors cursor-pointer">Carreiras</span>
                </Link>
              </li>
              <li>
                <Link href="/blog">
                  <span className="text-gray-600 hover:text-primary transition-colors cursor-pointer">Blog</span>
                </Link>
              </li>
              <li>
                <Link href="/contact">
                  <span className="text-gray-600 hover:text-primary transition-colors cursor-pointer">Contato</span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/terms">
                  <span className="text-gray-600 hover:text-primary transition-colors cursor-pointer">Termos de uso</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy">
                  <span className="text-gray-600 hover:text-primary transition-colors cursor-pointer">Política de privacidade</span>
                </Link>
              </li>
              <li>
                <Link href="/cookies">
                  <span className="text-gray-600 hover:text-primary transition-colors cursor-pointer">Política de cookies</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-500 text-sm">
            &copy; {currentYear} Discovery Events. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}