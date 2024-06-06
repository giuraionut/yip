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

  return { fetchDayMoods };
};

export default dayMoodService;
