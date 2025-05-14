import React, { useState } from 'react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import { X } from 'lucide-react'; // Import X icon

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLoginView, setIsLoginView] = useState(true);

  if (!isOpen) return null;

  const switchToRegister = () => setIsLoginView(false);
  const switchToLogin = () => setIsLoginView(true);

  const handleSuccess = (userData) => {
    if (onAuthSuccess) {
      onAuthSuccess(userData);
    }
    onClose(); // Close modal on successful auth
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-md flex justify-center items-center z-50 p-4">
      <div className="bg-white bg-opacity-95 p-8 rounded-lg shadow-2xl w-full max-w-md relative transform transition-all duration-300 ease-in-out scale-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        {isLoginView ? (
          <LoginForm onLoginSuccess={handleSuccess} switchToRegister={switchToRegister} />
        ) : (
          <RegisterForm onRegisterSuccess={handleSuccess} switchToLogin={switchToLogin} />
        )}
      </div>
    </div>
  );
};

export default AuthModal;

