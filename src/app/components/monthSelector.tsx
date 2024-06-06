import React, { useState } from 'react';
import { IMonth } from '../types/interfaces';
import {
  HeartOutlined,
  CheckCircleFilled,
  LoadingOutlined,
} from '@ant-design/icons';
import { Card } from 'antd';
import Meta from 'antd/es/card/Meta';

const months: IMonth[] = [
  { title: 'January', icon: '☃️', color: 'blue', index: 0 },
  { title: 'February', icon: '💝', color: 'red', index: 1 },
  { title: 'March', icon: '🍀', color: 'green', index: 2 },
  { title: 'April', icon: '☔', color: 'red', index: 3 },
  { title: 'May', icon: '🌸', color: 'green', index: 4 },
  { title: 'June', icon: '☀️', color: 'red', index: 5 },
  { title: 'July', icon: '🍦', color: 'blue', index: 6 },
  { title: 'August', icon: '🖋️', color: 'cyan', index: 7 },
  { title: 'September', icon: '🍎', color: 'blue', index: 8 },
  { title: 'October', icon: '🎃', color: 'orange', index: 9 },
  { title: 'November', icon: '🍂', color: 'blue', index: 10 },
  { title: 'December', icon: '❄️', color: 'green', index: 11 },
];

export const currentMonthName = (index: number) => {
  return months[index].title;
};
const MonthSelector: React.FC<{
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  currentMonth: number;
}> = ({ selectedMonth, setSelectedMonth, currentMonth }) => {
  return (
    <div className='grid grid-cols-6 gap-2'>
      {months.map((month) => (
        <Card
          key={month.title}
          className={`${
            selectedMonth === month.index ? 'bg-blue-400 ' : ''
          } text-center border-none hover:cursor-pointer hover:brightness-125`}
          onClick={() => setSelectedMonth(month.index)}
        >
          <Meta
            style={{ minHeight: '60px' }}
            title={`${month.title} ${
              month.index === currentMonth ? ' - Now' : ''
            }`}
            description={month.icon}
          />
        </Card>
      ))}
    </div>
  );
};

export default MonthSelector;
