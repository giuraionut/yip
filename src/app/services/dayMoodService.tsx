import { DayMood } from '@prisma/client';
const daysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const dayMoodService = () => {
  const fetchDayMoods = async (month: number, year: number) => {
    const cDate = new Date();
    const cM = cDate.getMonth();
    const cD = cDate.getDate();

    try {
      const response = await fetch('/api/daymood', {
        headers: {
          Accept: 'application/json',
          method: 'GET',
        },
      });
      if (response.ok) {
        const data = await response.json();
        const totalDays = daysInMonth(month, year);
        return Array.from({ length: totalDays }, (_, index) => {
          const date = new Date(year, month, index + 1);
          const title = date.toLocaleString('en-US', { weekday: 'short' });
          const moodForDay = data.find(
            (daymood: DayMood) =>
              daymood.day === index + 1 &&
              daymood.month === month &&
              daymood.year === year
          );
          return {
            index: index + 1,
            title,
            currentDay: index + 1 === cD && month === cM,
            mood: moodForDay?.mood,
          };
        });
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
