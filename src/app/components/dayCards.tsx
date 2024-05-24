import React from 'react';
import { Card } from 'antd';
import { IDay } from '../types/interfaces';

const DayCards: React.FC<{
  days: IDay[];
  setSelectedDay: (day: number) => void;
  setIsModalOpen: (open: boolean) => void;
}> = ({ days, setSelectedDay, setIsModalOpen }) => {
  return (
    <div className='grid grid-cols-4 gap-2'>
      {days.map((day) => (
        <Card
          style={
            day.mood
              ? { backgroundColor: day.mood.color }
              : day.currentDay
              ? { backgroundColor: 'red' }
              : { backgroundColor: 'rgb(51 65 85)' }
          }
          key={day.index}
          className='text-white text-center border-none hover:cursor-pointer hover:brightness-125'
          onClick={() => {
            setSelectedDay(day.index);
            setIsModalOpen(true);
          }}
        >
          {day.index} - {day.title}
        </Card>
      ))}
    </div>
  );
};

export default DayCards;
