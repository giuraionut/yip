'use client';
import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { Mood } from '@prisma/client';
import { IDay } from './types/interfaces';
import MonthSelector, { currentMonthName } from './components/monthSelector';
import DayCards from './components/dayCards';
import MoodModal from './components/moodModal';
import MoodChart from './components/moodChart';
import NavBar from './components/navBar';
import moodService from './services/moodService';
import dayMoodService from './services/dayMoodService';

const Home: React.FC = () => {
  const currentDate = new Date();
  const [currentDay, currentMonth, currentYear] = [
    currentDate.getDate(),
    currentDate.getMonth(),
    currentDate.getFullYear(),
  ];
  const [isDayModalOpen, setIsDayModalOpen] = useState(false);

  const [days, setDays] = useState<IDay[]>([]);
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);
  const [moods, setMoods] = useState<Mood[]>([]);

  const [daysLoading, setDaysLoading] = useState(true);
  const [moodsLoading, setMoodsLoading] = useState(true);
  const [createDayMoodLoading, setCreateDayMoodLoading] = useState(false);

  const { fetchMoods } = moodService();
  const { fetchDayMoods } = dayMoodService();

  useEffect(() => {
    const loadMoods = async () => {
      try {
        const moods = await fetchMoods();
        setMoods(moods);
        setMoodsLoading(false);
      } catch (error) {
      } finally {
        setMoodsLoading(false);
      }
    };
    loadMoods();
  }, []);

  useEffect(() => {
    const loadDayMoods = async () => {
      try {
        const dayMoods = await fetchDayMoods(selectedMonth, currentYear);
        setDays(dayMoods);
        setDaysLoading(false);
      } catch (error) {
      } finally {
        setDaysLoading(false);
      }
    };
    loadDayMoods();
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
        isModalOpen={isDayModalOpen}
        handleCancel={() => setIsDayModalOpen(false)}
        handleOk={() => setIsDayModalOpen(false)}
        moods={moods}
        selectedDay={selectedDay}
        selectedMonth={selectedMonth}
        currentYear={currentYear}
        setDays={setDays}
        setMoods={setMoods}
        setCreateDayMoodLoading={setCreateDayMoodLoading}
        createDayMoodLoading={createDayMoodLoading}
        moodsLoading={moodsLoading}
      />

      <div className='bg-slate-500 h-screen p-2'>
        <NavBar />
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
              {currentMonthName(selectedMonth)}
            </div>
            <DayCards
              days={days}
              setSelectedDay={setSelectedDay}
              setIsModalOpen={setIsDayModalOpen}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
