'use client';
import React, { useEffect, useState } from 'react';
import { Tag, Card, Modal, Flex, Button, Spin } from 'antd';
import {
  HeartOutlined,
  CheckCircleFilled,
  LoadingOutlined,
} from '@ant-design/icons';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { Mood, DayMood } from '@prisma/client';
import { IDay, MyDayMood, IMonth } from './types/interfaces';
ChartJS.register(ArcElement, Tooltip, Legend);

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
  const [chartData, setChartData] = useState<ChartData<'doughnut'>>();
  const [chartOptions, setChartOptions] = useState<ChartOptions<'doughnut'>>();
  const pushToPie = () => {};

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
    if (days.length > 0) {
      console.log('days', days);
      const currentMonthMoods: Mood[] = days
        .map((day: IDay) => day?.mood)
        .filter((mood): mood is Mood => mood !== undefined);

      console.log('currentMonthMoods', currentMonthMoods);

      const formattedData = currentMonthMoods.reduce(
        (result: { mood: string; value: number; color: string }[], mood) => {
          const existingMood = result.find((item) => item.mood === mood?.name);
          if (existingMood) {
            existingMood.value++;
          } else {
            result.push({
              mood: mood.name,
              value: 1,
              color: mood.color,
            });
          }
          return result;
        },
        []
      );
      const labels = formattedData.map((data) => data.mood);
      const data = formattedData.map((data) => data.value);
      const colors = formattedData.map((data) => data.color);
      const options: ChartOptions<'doughnut'> = {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
            align: 'start',
            labels: {
              color: '#fff',
              font: {
                weight: 'normal',
                size: 14,
              },
            },
          },
        },
      };
      setChartOptions(options);
      const chartData: ChartData<'doughnut'> = {
        labels: labels,
        datasets: [
          {
            label: 'Days',
            data: data,
            backgroundColor: colors,
            borderWidth: 1,
            hoverOffset: 4,
          },
        ],
      };

      setChartData(chartData);
    }
  }, [moods]);

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

  const createDayMood = async (data: DayMood) => {
    try {
      const response = await fetch('/api/daymood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create day mood');
      const newDayMood: MyDayMood = await response.json();
      setDays((prevDays) =>
        prevDays.map((day) => {
          return day.index === selectedDay
            ? { ...day, mood: newDayMood.mood }
            : day;
        })
      );
      setCreateDayMoodLoading(false);
    } catch (error) {
      console.error('Error creating mood:', error);
      // Provide user feedback, e.g., display an error message
    }
  };

  const handleCreateDayMood = async (mood: Mood) => {
    setCreateDayMoodLoading(true);
    //@ts-ignore
    const dayMood: DayMood = {
      day: selectedDay,
      month: selectedMonth,
      year: currentYear,
      moodId: mood.id,
    };
    await createDayMood(dayMood);
    handleOk();
  };

  const moodTags = moods.map((mood) => (
    <Tag
      color={mood.color}
      key={mood.id}
      onClick={() => handleCreateDayMood(mood)}
      className='hover:cursor-pointer font-bold hover:brightness-125'
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
              ? { backgroundColor: ' rgb(96 165 250)' }
              : { backgroundColor: 'rgb(51 65 85)' }
          }
          key={day.index}
          className='text-white text-center border-none hover:cursor-pointer hover:brightness-125'
          onClick={() => {
            setCreateDayMoodLoading(false);
            setSelectedDay(day.index);
            showModal();
          }}
        >
          {day.index} - {day.title}
        </Card>
      ))
    : [];

  return daysLoading ? (
    <div className='bg-slate-500 h-screen'>
      <div className='grid h-screen place-items-center'>
        <Spin />
      </div>
    </div>
  ) : (
    <>
      <Modal
        title='How was your day?'
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key='back' onClick={handleCancel} type='primary'>
            Cancel
          </Button>,
        ]}
      >
        <Flex gap='4px 0' vertical>
          <Flex gap='4px 0' wrap>
            {moodTags}
          </Flex>
          {createDayMoodLoading ? <Spin /> : ''}
        </Flex>
      </Modal>

      <div className='bg-slate-500 h-screen'>
        <div className='grid grid-cols-2 gap-2 p-5'>
          <div className='flex flex-col gap-3 p-5'>
            <div className='text-white font-bold bg-slate-700 p-2 rounded-md'>
              {currentYear}
            </div>
            <div className='grid grid-cols-4 gap-2'>{months}</div>
            <div>
              {chartData && chartOptions && (
                <div className='w-full max-w-md'>
                  <Doughnut data={chartData} options={chartOptions} />
                </div>
              )}
              <Button onClick={pushToPie}>Push</Button>
            </div>
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
