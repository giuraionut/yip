'use client';
import { Tag, Card, Modal, Flex } from 'antd';
import { useState } from 'react';
import { DateLogicComponent } from './components/DateLogicComponent';

export default function Home() {
  const {
    selectedMonth,
    setSelectedMonth,
    currentYear,
    selectedDay,
    setSelectedDay,
    getAllDaysOfMonth,
    allMonths,
    moods,
  } = DateLogicComponent();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleCreateMood = () => {
    console.log('Mood created');
  };
  const moodTags = moods.map((mood) => (
    <Tag
      color={mood.color.split('-')[1]}
      key={mood.value}
      onClick={handleCreateMood}
      className='hover:cursor-pointer font-bold'
    >
      {mood.name}
    </Tag>
  ));

  const months = allMonths.map((month) => {
    return (
      <Card
        key={month.title}
        className={
          (selectedMonth === month.index ? 'bg-blue-400 ' : 'bg-slate-700') +
          ' ' +
          'text-white text-center border-none hover:cursor-pointer hover:brightness-125'
        }
        onClick={() => setSelectedMonth(month.index)}
      >
        {month.title}
      </Card>
    );
  });
  const days = getAllDaysOfMonth(selectedMonth, currentYear).map((day) => {
    return (
      <Card
        key={day.index}
        className={
          (day.mood
            ? `${day.mood.color}`
            : day.currentDay
            ? 'bg-blue-400'
            : 'bg-slate-700') +
          ' ' +
          'text-white text-center border-none hover:cursor-pointer hover:brightness-125'
        }
        onClick={showModal}
      >
        {day.index} - {day.title}
      </Card>
    );
  });
  return (
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
              {allMonths[selectedMonth].title}
            </div>
            <div className='grid grid-cols-4 gap-2'>{days}</div>
          </div>
        </div>
      </div>
    </>
  );
}
