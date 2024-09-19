'use client';
import React, { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { DayEvent, DayMood, Event, Mood } from '@prisma/client';
import { IDay } from './types/interfaces';
import MonthSelector, { currentMonthName } from './components/monthSelector';
import DayCards from './components/dayCards';
import NavBar from './components/navBar';
import moodService from './services/moodService';
import dayMoodService from './services/dayMoodService';
import { Tabs } from 'antd';
import type { TabsProps } from 'antd';
import Link from 'next/link';
import DoughnutChart from './components/doughnutChart';
import RadarChart from './components/radarChart';
import DayModal from './components/dayModal';
import eventService from './services/eventService';
import dayEventService from './services/dayEventService';
import renderDays from './components/renderDays';
import { tailwindColors } from './utils';
import { useTheme } from './themeContext';
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
  const [events, setEvents] = useState<Event[]>([]);

  const [daysLoading, setDaysLoading] = useState(true);
  const [moodsLoading, setMoodsLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [createDayMoodLoading, setCreateDayMoodLoading] = useState(false);
  const [createDayEventLoading, setCreateDayEventLoading] = useState(false);

  const { fetchMoods } = moodService();
  const { fetchDayMoods } = dayMoodService();
  const { fetchEvents } = eventService();
  const { fetchDayEvents } = dayEventService();
  const { renderMonthDays } = renderDays();
  const { accentColor, darkMode } = useTheme();

  const tabsExtraAction = (
    <Link href='https://www.google.ro'>View more statistics</Link>
  );
  const onChangeTabs = (key: string) => {
    console.log(key);
  };
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Doughnut View',
      children: <DoughnutChart days={days} />,
    },
    {
      key: '2',
      label: 'Radar View',
      children: <RadarChart days={days} />,
    },
  ];

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
    const loadEvents = async () => {
      try {
        const events = await fetchEvents();
        setEvents(events);
        setEventsLoading(false);
      } catch (error) {
      } finally {
        setEventsLoading(false);
      }
    };
    loadEvents();
  }, []);

  useEffect(() => {
    const loadDays = async () => {
      const dayMoods = await fetchDayMoods(selectedMonth, currentYear);
      const dayEvents = await fetchDayEvents(selectedMonth, currentYear);
      const daysGrid = renderMonthDays(selectedMonth, currentYear);

      const updatedDaysGrid = daysGrid.map((week) =>
        week.map((day) => {
          if (!day) return null;
          const matchDayMood = dayMoods.find(
            (dayMood: DayMood) => dayMood.day === day.index
          );
          const matchDayEvent = dayEvents.find(
            (dayEvent: DayEvent) => dayEvent.day === day.index
          );
          return {
            ...day,
            ...(matchDayMood && { mood: matchDayMood.mood }),
            ...(matchDayEvent && { event: matchDayEvent.event }),
          };
        })
      );

      setDays(updatedDaysGrid.flat()); // Flatten the 2D array into a 1D array
      setDaysLoading(false);
    };
    loadDays();
  }, [selectedMonth, currentYear]);

  return daysLoading ? (
    <div>
      <div className='grid h-screen place-items-center'>
        <Spin />
      </div>
    </div>
  ) : (
    <>
      <DayModal
        isModalOpen={isDayModalOpen}
        handleCancel={() => setIsDayModalOpen(false)}
        handleOk={() => setIsDayModalOpen(false)}
        moods={moods}
        selectedDay={selectedDay}
        selectedMonth={selectedMonth}
        currentYear={currentYear}
        setDays={setDays}
        setMoods={setMoods}
        setEvents={setEvents}
        setCreateDayMoodLoading={setCreateDayMoodLoading}
        setCreateDayEventLoading={setCreateDayEventLoading}
        createDayMoodLoading={createDayMoodLoading}
        createDayEventLoading={createDayEventLoading}
        moodsLoading={moodsLoading}
        events={events}
      />

      <div>
        <div className='grid grid-cols-2 gap-2'>
          <div className='flex flex-col gap-3 p-5'>
            <div className='font-bold p-2 rounded-md'>{currentYear}</div>
            <MonthSelector
              selectedMonth={selectedMonth}
              setSelectedMonth={setSelectedMonth}
              currentMonth={currentMonth}
            />
            <div>
              <Tabs
                tabBarExtraContent={tabsExtraAction}
                defaultActiveKey='1'
                items={items}
                onChange={onChangeTabs}
              />
            </div>
          </div>

          <div className='flex flex-col gap-3 p-5'>
            <div
              className='font-bold p-2 rounded-md'
              style={{
                color: darkMode ? tailwindColors.white : tailwindColors.black,
              }}
            >
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
