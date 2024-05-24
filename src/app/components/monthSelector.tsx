import React, { useState } from 'react';
import { IMonth } from '../types/interfaces';
import {
  HeartOutlined,
  CheckCircleFilled,
  LoadingOutlined,
} from '@ant-design/icons';
import { Card } from 'antd';

const months: IMonth[] = [
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

export const currentMonthName = (index:number) =>{
  return months[index].title;
} 
const MonthSelector: React.FC<{
  selectedMonth: number;
  setSelectedMonth: (month: number) => void;
  currentMonth: number;
}> = ({ selectedMonth, setSelectedMonth, currentMonth }) => {
  return (
    <div className='grid grid-cols-4 gap-2'>
      {months.map((month) => (
        <Card
          key={month.title}
          className={`${
            selectedMonth === month.index ? 'bg-blue-400 ' : 'bg-slate-700'
          } text-white text-center border-none hover:cursor-pointer hover:brightness-125`}
          onClick={() => setSelectedMonth(month.index)}
        >
          {month.title}
        </Card>
      ))}
    </div>
  );
};

export default MonthSelector;
