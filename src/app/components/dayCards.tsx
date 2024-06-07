import React from 'react';
import { Card } from 'antd';
import Meta from 'antd/es/card/Meta';
import { IDay } from '../types/interfaces';

const DayCards: React.FC<{
  days: IDay[];
  setSelectedDay: (day: number) => void;
  setIsModalOpen: (open: boolean) => void;
}> = ({ days, setSelectedDay, setIsModalOpen }) => {
  const renderMonthDays = (days: IDay[]) => {
    const grid: (IDay | null)[][] = [[]];
    let currentWeek = 0;

    days.forEach((day, index) => {
      const isFirstDayOfWeek = index % 7 === 0;
      if (isFirstDayOfWeek && index !== 0) {
        currentWeek++;
        grid[currentWeek] = [];
      }
      grid[currentWeek].push(day);
    });
    return grid;
  };

  const daysGrid = renderMonthDays(days);
  const daysName = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];
  return (
    <>
      <div className='grid grid-cols-7 gap-2'>
        {daysName.map((day) => (
          <Card key={day} className={`text-white text-center border-none`}>
            <Meta title={day} description='' />
          </Card>
        ))}
      </div>
      <div className='grid grid-cols-7 gap-2'>
        {daysGrid.map((week, weekIndex) => (
          <React.Fragment key={weekIndex}>
            {week.map((day, dayIndex) => (
              <Card
                size='small'
                style={{
                  backgroundColor: day
                    ? day?.mood
                      ? day.mood.color
                      : day?.currentDay
                      ? 'rgb(30 0 160)'
                      : 'rgb(50 65 85)'
                    : '',
                }}
                key={day ? day.index : `${weekIndex}-${dayIndex}`}
                className={`text-white text-center border-none ${
                  day ? 'hover:cursor-pointer hover:brightness-125' : ''
                }`}
                onClick={() => {
                  if (day) {
                    setSelectedDay(day.index);
                    setIsModalOpen(true);
                  }
                }}
              >
                {day && (
                  <Meta
                    style={{ minHeight: '60px' }}
                    title={`${day.index} ${day.currentDay ? ' - Today' : ''}`}
                    description={[day.event?.name, day.event?.symbol]}
                  />
                )}
              </Card>
            ))}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

export default DayCards;
