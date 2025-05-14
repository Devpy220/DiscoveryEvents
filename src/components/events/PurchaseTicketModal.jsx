import React, { useState } from 'react';
import { purchaseTicket } from '../../services/ticketService';
import { X, Ticket as TicketIcon, Send } from 'lucide-react'; // Import icons

const PurchaseTicketModal = ({ isOpen, onClose, event, onPurchaseSuccess }) => {
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [purchasedTicket, setPurchasedTicket] = useState(null);

  if (!isOpen || !event) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setPurchasedTicket(null);
    try {
      const purchaseData = { 
        event_id: event.id, 
        buyer_name: buyerName, 
        buyer_email: buyerEmail 
      };
      const ticket = await purchaseTicket(purchaseData);
      setPurchasedTicket(ticket);
      if (onPurchaseSuccess) {
        onPurchaseSuccess(ticket);
      }
    } catch (err) {
      setError(err.message || 'Failed to purchase ticket. Please try again.');
    }
    setLoading(false);
  };

  const handleClose = () => {
    setBuyerName('');
    setBuyerEmail('');
    setError('');
    setPurchasedTicket(null);
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-md flex justify-center items-center z-50 p-4 transition-opacity duration-300 ease-in-out">
      <div className="bg-white bg-opacity-95 p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-lg relative transform transition-all duration-300 ease-in-out scale-100 opacity-100">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition-colors"
          aria-label="Close modal"
        >
          <X size={24} />
        </button>
        
        <h2 className="text-2xl font-semibold text-center mb-6 text-indigo-700">Buy Ticket for {event.name}</h2>
        
        {purchasedTicket ? (
          <div className="text-center">
            <TicketIcon size={48} className="mx-auto text-green-500 mb-3" />
            <h3 className="text-xl font-semibold text-green-600 mb-2">Purchase Successful!</h3>
            <p className="text-gray-700 mb-1">Your ticket code is: <strong className="text-gray-900">{purchasedTicket.ticket_code}</strong></p>
            <p className="text-gray-700 mb-1">Event: {purchasedTicket.event_name}</p>
            <p className="text-gray-700 mb-4">An email confirmation will be sent to <strong className="text-gray-900">{purchasedTicket.buyer_email}</strong>.</p>
            <button 
              onClick={handleClose}
              className="w-full mt-4 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-150"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <p className="text-red-500 text-sm text-center py-2 bg-red-100 border border-red-300 rounded-md">{error}</p>}
            <div className="p-3 bg-indigo-50 rounded-md border border-indigo-200">
                <p className="text-sm text-indigo-700"><strong>Event:</strong> {event.name}</p>
                <p className="text-sm text-indigo-700"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()} at {event.time}</p>
                <p className="text-sm font-semibold text-indigo-700"><strong>Price:</strong> ${event.price ? event.price.toFixed(2) : '0.00'}</p>
            </div>
            
            <div>
              <label htmlFor="buyer-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name*</label>
              <input
                id="buyer-name"
                type="text"
                value={buyerName}
                onChange={(e) => setBuyerName(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-150"
              />
            </div>
            <div>
              <label htmlFor="buyer-email" className="block text-sm font-medium text-gray-700 mb-1">Email Address*</label>
              <input
                id="buyer-email"
                type="email"
                value={buyerEmail}
                onChange={(e) => setBuyerEmail(e.target.value)}
                required
                className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors duration-150"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-colors duration-150"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Purchase...
                </>
              ) : (
                <>
                  <Send size={18} className="mr-2" /> Buy Ticket for ${event.price ? event.price.toFixed(2) : '0.00'}
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default PurchaseTicketModal;

