import React from 'react';

const EventItem = ({ event, onEdit, onDelete, onSelect }) => {
  if (!event) {
    return null;
  }

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(event);
    }
  };

  return (
    <div 
      className={`bg-white shadow-lg rounded-lg p-4 mb-4 border border-gray-200 hover:shadow-xl transition-shadow duration-200 ease-in-out ${onSelect ? 'cursor-pointer' : ''}`}
      onClick={onSelect ? handleCardClick : undefined}
    >
      <h3 className="text-xl font-semibold text-indigo-700 mb-2">{event.name}</h3>
      <p className="text-gray-600 text-sm mb-1"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()} at {event.time}</p>
      <p className="text-gray-600 text-sm mb-1"><strong>Location:</strong> {event.location}</p>
      <p className="text-gray-600 text-sm mb-3"><strong>Price:</strong> ${event.price ? event.price.toFixed(2) : '0.00'}</p>
      {event.description && <p className="text-gray-700 text-sm mb-3 bg-gray-50 p-2 rounded">{event.description}</p>}
      {/* <p className="text-xs text-gray-400">Organizer: {event.organizer_username || 'N/A'}</p> */}
      {(onEdit || onDelete) && (
        <div className="mt-4 flex justify-end space-x-2">
          {onEdit && (
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(event); }}
              className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button 
              onClick={(e) => { e.stopPropagation(); onDelete(event.id); }}
              className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EventItem;

