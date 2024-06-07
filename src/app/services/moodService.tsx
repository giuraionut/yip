import { Mood } from '@prisma/client';

const moodService = () => {
  const fetchMoods = async () => {
    try {
      const response = await fetch('/api/mood', {
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

  const deleteMood = async (mood: Mood) => {
    try {
      const response = await fetch('/api/mood', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: mood.id }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete mood');
      }
    } catch (error) {
      throw error;
    }
  };

  return { fetchMoods, deleteMood };
};

export default moodService;
