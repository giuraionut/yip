'use client';
import React, { useEffect, useState } from 'react';
import { Tag, Card, Modal, Flex } from 'antd';
import { DateLogicComponent } from './components/DateLogicComponent';
import { Moods } from './components/Moods';
import { DayMood, Mood } from '@prisma/client';

interface IDay {
  title: string;
  index: number;
  currentDay?: boolean;
  mood?: Mood;
}

const Home: React.FC = () => {
  const {
    selectedMonth,
    setSelectedMonth,
    currentYear,
    selectedDay,
    currentDay,
    setSelectedDay,
    getAllDaysOfMonth,
    allMonths,
  } = DateLogicComponent();

  const moods = Moods();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [days, setDays] = useState<IDay[]>([]);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    console.log('USE EFFECT');
    console.log('selectedMonth', selectedMonth);
    const updatedDays = getAllDaysOfMonth(selectedMonth, currentYear);
    setDays(updatedDays);
    console.log(updatedDays);
    setLoading(false);
  }, [selectedMonth, currentYear]);

  const showModal = () => setIsModalOpen(true);
  const handleOk = () => setIsModalOpen(false);
  const handleCancel = () => setIsModalOpen(false);

  const createDayMood = async (data: DayMood) => {
    try {
      const response = await fetch('/api/daymood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create day mood');
      const updatedMood: Mood = await response.json();
      setDays((prevDays) =>
        prevDays.map((day) =>
          day.index === selectedDay ? { ...day, mood: updatedMood } : day
        )
      );
    } catch (error) {
      console.error('Error creating mood:', error);
      // Provide user feedback, e.g., display an error message
    }
  };

  const handleCreateDayMood = async (mood: Mood) => {
    //@ts-ignore
    const dayMood: DayMood = {
      day: selectedDay,
      month: selectedMonth,
      year: currentYear,
      moodId: mood.id,
    };
    await createDayMood(dayMood);
  };

  const moodTags = moods.map((mood) => (
    <Tag
      color={mood.color}
      key={mood.name}
      onClick={() => handleCreateDayMood(mood)}
      className='hover:cursor-pointer font-bold'
    >
      {mood.name}
    </Tag>
  ));

  const months = allMonths.map((month) => (
    <Card
      key={month.title}
      className={`${
        selectedMonth === month.index ? 'bg-blue-400 ' : 'bg-slate-700'
      } text-white text-center border-none hover:cursor-pointer hover:brightness-125`}
      onClick={() => setSelectedMonth(month.index)}
    >
      {month.title}
    </Card>
  ));

  const daysCards = days
    ? days.map((day) => (
        <Card
          key={day.index}
          className={`${
            day.mood
              ? `bg-${day.mood.color}-700`
              : day.currentDay
              ? 'bg-blue-400'
              : 'bg-slate-700'
          } text-white text-center border-none hover:cursor-pointer hover:brightness-125`}
          onClick={() => {
            setSelectedDay(day.index);
            showModal();
          }}
        >
          {day.index} - {day.title}
        </Card>
      ))
    : [];

  return loading ? (
    'loading...'
  ) : (
    <>
      <Modal
        title='How was your day?'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Flex gap='4px 0' wrap>
          {moodTags}
        </Flex>
      </Modal>
      
      <div className='bg-slate-500 h-screen'>
        <div className='grid grid-cols-2 gap-2 p-5'>
          <div className='flex flex-col gap-3 p-5'>
            <div className='text-white font-bold bg-slate-700 p-2 rounded-md'>
              {currentYear}
            </div>
            <div className='grid grid-cols-4 gap-2'>{months}</div>
          </div>

          <div className='flex flex-col gap-3 p-5'>
            <div className='text-white font-bold bg-slate-700 p-2 rounded-md'>
              {allMonths[selectedMonth].title} - {currentDay}
            </div>
            <div className='grid grid-cols-4 gap-2'>{daysCards}</div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
