import React, { useState, useEffect, useCallback } from 'react';
import EventForm from './EventForm';
import EventItem from './EventItem';
import { getOrganizerEvents, createEvent, updateEvent, deleteEvent } from '../../services/eventService';

const EventManagement = ({ organizer }) => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null); // Event object to edit

  const fetchEvents = useCallback(async () => {
    if (!organizer || !organizer.id) return;
    setIsLoading(true);
    setError('');
    try {
      const data = await getOrganizerEvents(organizer.id);
      setEvents(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch events.');
      setEvents([]); // Clear events on error
    }
    setIsLoading(false);
  }, [organizer]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const handleCreateEvent = async (eventData) => {
    if (!organizer || !organizer.id) {
      setError('Organizer not identified. Cannot create event.');
      return;
    }
    setIsLoading(true);
    try {
      await createEvent(eventData, organizer.id);
      setShowCreateForm(false);
      fetchEvents(); // Refresh list
    } catch (err) {
      setError(err.message || 'Failed to create event.');
      // Keep form open on error to allow correction
    }
    setIsLoading(false);
  };

  const handleUpdateEvent = async (eventData) => {
    if (!editingEvent || !editingEvent.id) return;
    setIsLoading(true);
    try {
      await updateEvent(editingEvent.id, eventData);
      setEditingEvent(null); // Close edit form
      fetchEvents(); // Refresh list
    } catch (err) {
      setError(err.message || 'Failed to update event.');
      // Keep form open
    }
    setIsLoading(false);
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    setIsLoading(true);
    try {
      await deleteEvent(eventId);
      fetchEvents(); // Refresh list
    } catch (err) {
      setError(err.message || 'Failed to delete event.');
    }
    setIsLoading(false);
  };

  const openEditForm = (event) => {
    setEditingEvent(event);
    setShowCreateForm(false); // Ensure create form is hidden
  };

  const openCreateForm = () => {
    setEditingEvent(null); // Ensure edit form is hidden
    setShowCreateForm(true);
  };

  const closeForms = () => {
    setShowCreateForm(false);
    setEditingEvent(null);
    setError(''); // Clear any form-specific errors
  }

  if (!organizer) {
    return <p className="text-center text-gray-600">Please log in to manage events.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">My Events</h2>
        <button
          onClick={openCreateForm}
          className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          Create New Event
        </button>
      </div>

      {error && <p className="text-red-500 text-sm text-center py-2 bg-red-100 border border-red-300 rounded mb-4">{error}</p>}
      {isLoading && <p className="text-center text-gray-500">Loading events...</p>}

      {(showCreateForm || editingEvent) && (
        <div className="mb-8">
          <EventForm 
            onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
            initialData={editingEvent || {}}
            onCancel={closeForms}
            submitButtonText={editingEvent ? 'Update Event' : 'Create Event'}
          />
        </div>
      )}

      {!isLoading && events.length === 0 && !showCreateForm && !editingEvent && (
        <p className="text-center text-gray-500">You haven't created any events yet.</p>
      )}

      {!showCreateForm && !editingEvent && events.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map(event => (
            <EventItem 
              key={event.id} 
              event={event} 
              onEdit={() => openEditForm(event)} 
              onDelete={() => handleDeleteEvent(event.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default EventManagement;

