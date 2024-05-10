import { HeartOutlined } from '@ant-design/icons';
import { useState } from 'react';

export function DateLogicComponent() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // Note: Months are zero-based (0 = January, 1 = February, etc.)
  const currentDay = currentDate.getDate();
  console.log('currentMonth', currentMonth, 'currentDay', currentDay);

  interface IMonth {
    title: string;
    icon: any; // You might want to replace 'any' with more specific props if possible
    color: string;
    index: number;
    currentMonth?: boolean; // Optional property
  }

  interface IDay {
    title: string;
    index: number;
    currentDay?: boolean;
    mood?: IMood;
  }

  interface IMood {
    name: string;
    color: string;
    value: number;
  }
  const moods: IMood[] = [
    { name: 'Happy', color: 'bg-green-300', value: 1 },
    { name: 'Sad', color: 'bg-red-300', value: 2 },
    { name: 'Normal', color: 'bg-blue-300', value: 3 },
  ];

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
  ];
  allMonths.forEach((month) => {
    if (month.index === currentMonth) {
      month.currentMonth = true;
    }
  });

  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [selectedDay, setSelectedDay] = useState(currentDay);

  const daysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getAllDaysOfMonth = (month: number, year: number) => {
    const days: IDay[] = [];
    const totalDays = daysInMonth(month, year);
    for (let index = 1; index <= totalDays; index++) {
      const date = new Date(year, month, index);
      const title = date.toLocaleString('en-US', { weekday: 'long' });
      if (index === currentDay && currentMonth === selectedMonth) {
        days.push({ index, title, currentDay: true });
      }
      days.push({ index, title, mood: moods[2] });
    }
    return days;
  };

  return {
    selectedMonth,
    setSelectedMonth,
    currentYear,
    selectedDay,
    setSelectedDay,
    getAllDaysOfMonth,
    allMonths,
    moods,
  };
}
