import React, { useState, useEffect } from "react";
import "./App.css";
import AuthModal from "./components/auth/AuthModal";
import EventManagement from "./components/events/EventManagement";
import PublicEventList from "./components/events/PublicEventList";
import PurchaseTicketModal from "./components/events/PurchaseTicketModal";
import { LogIn, LogOut, UserPlus, Home, CalendarDays, Ticket } from 'lucide-react'; // Added icons

function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); 
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [selectedEventForPurchase, setSelectedEventForPurchase] = useState(null);
  const [activeView, setActiveView] = useState('public'); // 'public', 'organizer'

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        setActiveView('organizer'); // If user is stored, default to organizer view
      } catch (e) {
        console.error("Error parsing stored user:", e);
        localStorage.removeItem("currentUser");
        setActiveView('public');
      }
    } else {
      setActiveView('public');
    }
  }, []);

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const handleAuthSuccess = (userData) => {
    console.log("Authenticated user:", userData);
    setCurrentUser(userData);
    localStorage.setItem("currentUser", JSON.stringify(userData));
    setActiveView('organizer');
    closeAuthModal();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    setActiveView('public');
    console.log("User logged out");
  };

  const openPurchaseModal = (event) => {
    setSelectedEventForPurchase(event);
    setIsPurchaseModalOpen(true);
  };

  const closePurchaseModal = () => {
    setSelectedEventForPurchase(null);
    setIsPurchaseModalOpen(false);
  };

  const handlePurchaseSuccess = (ticket) => {
    console.log("Ticket purchased:", ticket);
  };

  // Simple icon button component
  const IconButton = ({ onClick, icon: Icon, label, className = '' }) => (
    <button
      onClick={onClick}
      aria-label={label}
      className={`p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-colors ${className}`}
    >
      <Icon size={24} />
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex flex-col text-gray-800">
      <header className="w-full py-3 bg-white bg-opacity-10 backdrop-blur-lg shadow-lg sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center px-4">
          <div className="flex items-center space-x-2 text-white">
            <Ticket size={32} className="text-yellow-300"/>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">DiscoveryEvent&apos;s</h1>
          </div>
          <nav className="flex items-center space-x-2">
            {currentUser ? (
              <>
                <span className="text-white text-sm hidden sm:block">Olá, {currentUser.username}</span>
                <IconButton onClick={handleLogout} icon={LogOut} label="Logout" className="text-white"/>
              </>
            ) : (
              <button 
                onClick={openAuthModal} 
                className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-lg transition-colors text-sm font-medium backdrop-blur-sm shadow-md"
              >
                <UserPlus size={20}/>
                <span>Organizador Login/Cadastro</span>
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 sm:p-6 md:p-8">
        {/* Navigation for views could be added here if needed */}
        {/* For now, view is determined by login state */}
        {activeView === 'organizer' && currentUser ? (
          <EventManagement organizer={currentUser} />
        ) : (
          <PublicEventList onEventSelect={openPurchaseModal} />
        )}
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        onAuthSuccess={handleAuthSuccess}
      />

      {selectedEventForPurchase && (
        <PurchaseTicketModal
          isOpen={isPurchaseModalOpen}
          onClose={closePurchaseModal}
          event={selectedEventForPurchase}
          onPurchaseSuccess={handlePurchaseSuccess}
        />
      )}

      <footer className="w-full py-4 bg-black bg-opacity-30 backdrop-blur-md text-white text-center text-xs sm:text-sm">
        <p>&copy; {new Date().getFullYear()} DiscoveryEvent&apos;s. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default App;

