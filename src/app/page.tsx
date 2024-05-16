'use client';
import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { Mood, DayMood } from '@prisma/client';
import { IDay } from './types/interfaces';
import MonthSelector from './components/monthSelector';
import DayCards from './components/dayCards';
import MoodModal from './components/moodModal';
import MoodChart from './components/moodChart';

const Home: React.FC = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // Note: Months are zero-based (0 = January, 1 = February, etc.)
  const currentDay = currentDate.getDate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [days, setDays] = useState<IDay[]>([]);
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [daysLoading, setDaysLoading] = useState(true);
  const [moodsLoading, setMoodsLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [moods, setMoods] = useState<Mood[]>([]); // Annotate moods as Mood[]
  const [buttonIconPosition, setButtonIconPosition] = useState<'start' | 'end'>(
    'end'
  );

  const [createDayMoodLoading, setCreateDayMoodLoading] = useState(false);
  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  const daysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  useEffect(() => {
    const fetchMoods = async () => {
      try {
        const response = await fetch('/api/mood', {
          headers: {
            Accept: 'application/json',
            method: 'GET',
          },
        });
        if (response.ok) {
          const data = await response.json();

          setMoods(data);
          setMoodsLoading(false);
        } else {
          throw new Error('Failed to fetch moods');
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchMoods();
  }, []);

  useEffect(() => {
    const fetchDayMoods = async () => {
      try {
        const response = await fetch('/api/daymood', {
          headers: {
            Accept: 'application/json',
            method: 'GET',
          },
        });
        if (response.ok) {
          const data = await response.json();

          const totalDays = daysInMonth(selectedMonth, currentYear);
          const d = Array.from({ length: totalDays }, (_, index) => {
            const date = new Date(currentYear, selectedMonth, index + 1);
            const title = date.toLocaleString('en-US', { weekday: 'long' });
            const moodForDay = data.find(
              (daymood: DayMood) =>
                daymood.day === index + 1 &&
                daymood.month === selectedMonth &&
                daymood.year === currentYear
            );
            return {
              index: index + 1,
              title,
              currentDay:
                index + 1 === currentDay && selectedMonth === currentMonth,
              mood: moodForDay?.mood,
            };
          });
          setDays(d);
          setDaysLoading(false); // Move setLoading inside the success branch of the if statement
        } else {
          throw new Error('Failed to fetch day moods');
        }
      } catch (error) {
        console.log(error);
        setDaysLoading(false); // Move setLoading inside the catch block to handle errors
      }
    };

    fetchDayMoods();
  }, [selectedMonth, currentYear]);

  return daysLoading ? (
    <div className='bg-slate-500 h-screen'>
      <div className='grid h-screen place-items-center'>
        <Spin />
      </div>
    </div>
  ) : (
    <>
      <MoodModal
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        handleOk={handleOk}
        moods={moods}
        selectedDay={selectedDay}
        selectedMonth={selectedMonth}
        currentYear={currentYear}
        setDays={setDays}
        setCreateDayMoodLoading={setCreateDayMoodLoading}
        createDayMoodLoading={createDayMoodLoading}
      />
      <div className='bg-slate-500 h-screen'>
        <div className='grid grid-cols-2 gap-2 p-5'>
          <div className='flex flex-col gap-3 p-5'>
            <div className='text-white font-bold bg-slate-700 p-2 rounded-md'>
              {currentYear}
            </div>
            <MonthSelector
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              currentMonth={currentMonth}
            />
            <div>
              <MoodChart days={days} />
            </div>
          </div>

          <div className='flex flex-col gap-3 p-5'>
            <div className='text-white font-bold bg-slate-700 p-2 rounded-md'>
              currentMonth
            </div>
            <DayCards
              days={days}
              setSelectedDay={setSelectedDay}
              setIsModalOpen={setIsModalOpen}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
