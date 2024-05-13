import { HeartOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { DaysMood } from './DaysMood';

export function DateLogicComponent() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // Note: Months are zero-based (0 = January, 1 = February, etc.)
  const currentDay = currentDate.getDate();

  interface IMonth {
    title: string;
    icon: JSX.Element; // Updated 'icon' type to JSX.Element
    color: string;
    index: number;
    currentMonth?: boolean;
  }

  const dayMoods = DaysMood();

  const allMonths: IMonth[] = [
    { title: 'January', icon: <HeartOutlined />, color: 'blue', index: 0 },
    { title: 'February', icon: <HeartOutlined />, color: 'red', index: 1 },
    { title: 'March', icon: <HeartOutlined />, color: 'green', index: 2 },
    { title: 'April', icon: <HeartOutlined />, color: 'red', index: 3 },
    { title: 'May', icon: <HeartOutlined />, color: 'green', index: 4 },
    { title: 'June', icon: <HeartOutlined />, color: 'red', index: 5 },
    { title: 'July', icon: <HeartOutlined />, color: 'blue', index: 6 },
    { title: 'August', icon: <HeartOutlined />, color: 'cyan', index: 7 },
    { title: 'September', icon: <HeartOutlined />, color: 'blue', index: 8 },
    { title: 'October', icon: <HeartOutlined />, color: 'orange', index: 9 },
    { title: 'November', icon: <HeartOutlined />, color: 'blue', index: 10 },
    { title: 'December', icon: <HeartOutlined />, color: 'green', index: 11 },
  ].map((month) => ({
    ...month,
    currentMonth: month.index === currentMonth,
  }));

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedDay, setSelectedDay] = useState(currentDay);

  const daysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getAllDaysOfMonth = (month: number, year: number) => {
    const totalDays = daysInMonth(month, year);
    return Array.from({ length: totalDays }, (_, index) => {
      const date = new Date(year, month, index + 1);
      const title = date.toLocaleString('en-US', { weekday: 'long' });
      const moodForDay = dayMoods.find(
        (daymood) =>
          daymood.day === index + 1 &&
          daymood.month === month &&
          daymood.year === year
      );
      return {
        index: index + 1,
        title,
        currentDay: index + 1 === currentDay && month === currentMonth,
        mood: moodForDay?.mood,
      };
    });
  };

  return {
    selectedMonth,
    setSelectedMonth,
    currentYear,
    selectedDay,
    currentDay,
    setSelectedDay,
    getAllDaysOfMonth,
    allMonths,
  };
}
