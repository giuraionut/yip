import { Event } from '@prisma/client';
const eventService = () => {
  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/event', {
        headers: {
          Accept: 'application/json',
          method: 'GET',
        },
      });
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('Failed to fetch moods');
      }
    } catch (error) {
      throw error;
    }
  };

  const createEvent = async (event: Event) => {
    try {
      const response = await fetch('/api/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: event.name, symbol: event.symbol }),
      });
      if (!response.ok) throw new Error('Failed to create event');
      return (await response.json()) as Event;
    } catch (error) {
      throw error;
    }
  };


  return { fetchEvents, createEvent };
};

export default eventService;
