import { DayMood } from '@prisma/client';
import { MyDayMood } from '../types/interfaces';

const dayMoodService = () => {
  const fetchDayMoods = async (month: number, year: number) => {
    try {
      const response = await fetch(`/api/daymood?year=${year}&month=${month}`, {
        headers: {
          Accept: 'application/json',
        },
        method: 'GET',
      });
      if (response.ok) {
        return await response.json();
      } else {
        throw new Error('Failed to fetch moods');
      }
    } catch (error) {
      throw error;
    }
  };

  const createDayMood = async (data: DayMood) => {
    try {
      const response = await fetch('/api/daymood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create day mood');
      return (await response.json()) as MyDayMood;
    } catch (error) {
      throw error;
    }
  };

  const deleteDayMood = async (day: number, month: number, year: number) => {
    try {
      const response = await fetch('/api/daymood', {
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
        throw new Error(errorData.message || 'Failed to delete day mood');
      }
    } catch (error) {
      throw error;
    }
  };

  return { fetchDayMoods, createDayMood, deleteDayMood };
};

export default dayMoodService;
