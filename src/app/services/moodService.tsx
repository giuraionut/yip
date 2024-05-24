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

  return { fetchMoods };
};

export default moodService;
