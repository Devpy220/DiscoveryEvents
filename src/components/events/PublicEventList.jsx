import React, { useState, useEffect } from 'react';
import { getEvents } from '../../services/eventService'; // Assuming getEvents fetches all public events
import EventItem from './EventItem'; // Re-use EventItem for consistent display

const PublicEventList = ({ onEventSelect }) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPublicEvents = async () => {
      setIsLoading(true);
      setError('');
      try {
        const data = await getEvents(); // Fetches all events
        setEvents(data || []);
      } catch (err) {
        setError(err.message || 'Failed to fetch events.');
        setEvents([]);
      }
      setIsLoading(false);
    };

    fetchPublicEvents();
  }, []);

  if (isLoading) {
    return <p className="text-center text-gray-500 py-8">Loading events...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 py-8">Error: {error}</p>;
  }

  if (events.length === 0) {
    return <p className="text-center text-gray-500 py-8">No events available at the moment. Please check back later!</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Upcoming Events</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => (
          <EventItem 
            key={event.id} 
            event={event} 
            onSelect={onEventSelect} // Pass a handler for when an event is selected (e.g., to show details or buy ticket)
            // No onEdit or onDelete for public view
          />
        ))}
      </div>
    </div>
  );
};

export default PublicEventList;

