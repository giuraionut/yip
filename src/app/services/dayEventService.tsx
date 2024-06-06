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

  return { fetchDayEvents };
};

export default dayEventService;
