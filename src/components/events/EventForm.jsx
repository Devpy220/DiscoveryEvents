import React, { useState, useEffect } from 'react';

const EventForm = ({ onSubmit, initialData = {}, onCancel, submitButtonText = 'Create Event' }) => {
  const [name, setName] = useState(initialData.name || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [date, setDate] = useState(initialData.date ? initialData.date.split('T')[0] : ''); // Expect YYYY-MM-DD
  const [time, setTime] = useState(initialData.time || ''); // Expect HH:MM
  const [location, setLocation] = useState(initialData.location || '');
  const [price, setPrice] = useState(initialData.price || 0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
      setDate(initialData.date ? initialData.date.split('T')[0] : '');
      setTime(initialData.time || '');
      setLocation(initialData.location || '');
      setPrice(initialData.price || 0);
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!name || !date || !time || !location || price < 0) {
      setError('Please fill in all required fields: Name, Date, Time, Location, and Price.');
      return;
    }
    setLoading(true);
    try {
      // The time from input type="time" is HH:MM, backend might expect HH:MM:SS
      const formattedTime = time.includes(':') && time.split(':').length === 2 ? `${time}:00` : time;
      await onSubmit({ 
        name, 
        description, 
        date, 
        time: formattedTime, 
        location, 
        price: parseFloat(price) 
      });
      // Optionally reset form or handle success state in parent
    } catch (err) {
      setError(err.message || 'Failed to submit event. Please try again.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      {error && <p className="text-red-500 text-sm text-center py-2 bg-red-100 border border-red-300 rounded">{error}</p>}
      <div>
        <label htmlFor="event-name" className="block text-sm font-medium text-gray-700">Event Name*</label>
        <input
          id="event-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="event-description" className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="event-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="event-date" className="block text-sm font-medium text-gray-700">Date*</label>
          <input
            id="event-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="event-time" className="block text-sm font-medium text-gray-700">Time*</label>
          <input
            id="event-time"
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
      </div>
      <div>
        <label htmlFor="event-location" className="block text-sm font-medium text-gray-700">Location*</label>
        <input
          id="event-location"
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label htmlFor="event-price" className="block text-sm font-medium text-gray-700">Price (USD)*</label>
        <input
          id="event-price"
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          min="0"
          step="0.01"
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>
      <div className="flex items-center justify-end space-x-3">
        {onCancel && (
            <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                Cancel
            </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Submitting...' : submitButtonText}
        </button>
      </div>
    </form>
  );
};

export default EventForm;

