import { IDay } from '../types/interfaces';

const daysInMonth = (month: number, year: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const renderDays = () => {
  const renderMonthDays = (month: number, year: number) => {
    const cDate = new Date();
    const cM = cDate.getMonth();
    const cD = cDate.getDate();
    const totalDays = daysInMonth(month, year);
    const grid: (IDay | null)[][] = [[]];
    let currentWeek = 0;
    let dayCounter = 1;
    const firstDay = new Date(year, month, 1).getDay(); // Get the first day of the month (0-indexed, starting from Sunday)

    // Adjust first day to make sure the last two days are Saturday and Sunday
    // const adjustedFirstDay = (firstDay === 0 ? 6 : firstDay - 1) % 7;
    const adjustedFirstDay = firstDay;

    // Add empty slots before the first day
    for (let i = 0; i < adjustedFirstDay; i++) {
      grid[currentWeek].push(null);
    }

    // Fill in the grid with days
    while (dayCounter <= totalDays) {
      if (grid[currentWeek].length >= 7) {
        // Start a new row if the current row is full
        currentWeek++;
        grid[currentWeek] = [];
      }
      grid[currentWeek].push({
        index: dayCounter,
        title: new Date(year, month, dayCounter).toLocaleString('en-US', {
          weekday: 'short',
        }),
        currentDay: dayCounter === cD && month === cM,
      });
      dayCounter++;
    }

    return grid;
  };

  return { renderMonthDays };
};

export default renderDays;
