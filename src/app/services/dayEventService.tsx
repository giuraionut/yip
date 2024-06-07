import { DayEvent } from '@prisma/client';
import { MyDayEvent } from '../types/interfaces';

const dayEventService = () => {
  const fetchDayEvents = async (month: number, year: number) => {
    try {
      const response = await fetch(
        `/api/dayevent?year=${year}&month=${month}`,
        {
          headers: {
            Accept: 'application/json',
          },
          method: 'GET',
        }
      );
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to fetch events');
      }
    } catch (error) {
      throw error;
    }
  };

  const createDayEvent = async (data: DayEvent) => {
    try {
      const response = await fetch('/api/dayevent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create day mood');
      return (await response.json()) as MyDayEvent;
    } catch (error) {
      throw error;
    }
  };
  const deleteDayEvent = async (day: number, month: number, year: number) => {
    try {
      const response = await fetch('/api/dayevent', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          day: day,
          month: month,
          year: year,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete day event');
      }
      return response.ok;
    } catch (error) {
      throw error;
    }
  };

  return { fetchDayEvents, createDayEvent, deleteDayEvent };
};

export default dayEventService;
