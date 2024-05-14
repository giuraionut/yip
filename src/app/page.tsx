'use client';
import React, { useEffect, useState } from 'react';
import { Tag, Card, Modal, Flex } from 'antd';
import { DayMood, Mood } from '@prisma/client';
import { HeartOutlined } from '@ant-design/icons';

interface IDay {
  title: string;
  index: number;
  currentDay?: boolean;
  mood?: Mood;
}

const Home: React.FC = () => {
  interface IMonth {
    title: string;
    icon: JSX.Element; // Updated 'icon' type to JSX.Element
    color: string;
    index: number;
    currentMonth?: boolean;
  }

  interface MyDayMood extends DayMood {
    mood: Mood;
  }

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [days, setDays] = useState<IDay[]>([]);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // Note: Months are zero-based (0 = January, 1 = February, etc.)
  const currentDay = currentDate.getDate();
  const [selectedDay, setSelectedDay] = useState(currentDay);

  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth);

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
  const daysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const [moods, setMoods] = useState<Mood[]>([]); // Annotate moods as Mood[]

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
    console.log('useeffect');
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
          setLoading(false); // Move setLoading inside the success branch of the if statement
          console.log('data', data);
        } else {
          throw new Error('Failed to fetch day moods');
        }
      } catch (error) {
        console.log(error);
        setLoading(false); // Move setLoading inside the catch block to handle errors
      }
    };

    fetchDayMoods();
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
          style={
            day.mood
              ? { backgroundColor: day.mood.color }
              : day.currentDay
              ? { backgroundColor: ' rgb(96, 165, 250)' }
              : { backgroundColor: 'rgb(51 65 85)' }
          }
          key={day.index}
          className='text-white text-center border-none hover:cursor-pointer hover:brightness-125'
          onClick={() => {
            setSelectedDay(day.index);
            showModal();
          }}
        >
          {day.index} - {day.title}
        </Card>
      ))
    : [];
  // const daysCards = days
  //   ? days.map((day) => (
  //       <Card
  //         key={day.index}
  //         className={`${
  //           day.mood
  //             ? `bg-${day.mood.color}-700`
  //             : day.currentDay
  //             ? 'bg-blue-400'
  //             : 'bg-slate-700'
  //         } text-white text-center border-none hover:cursor-pointer hover:brightness-125`}
  //         onClick={() => {
  //           setSelectedDay(day.index);
  //           showModal();
  //         }}
  //       >
  //         {day.index} - {day.title}
  //       </Card>
  //     ))
  //   : [];

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
