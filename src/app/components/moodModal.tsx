import React from 'react';
import { Modal, Tag, Flex, Button, Spin } from 'antd';
import { Mood, DayMood } from '@prisma/client';
import { IDay, MyDayMood } from '../types/interfaces';

const MoodModal: React.FC<{
  isModalOpen: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  moods: Mood[];
  selectedDay: number;
  selectedMonth: number;
  currentYear: number;
  setDays: React.Dispatch<React.SetStateAction<IDay[]>>;
  setCreateDayMoodLoading: React.Dispatch<React.SetStateAction<boolean>>;
  createDayMoodLoading: boolean;
}> = ({
  isModalOpen,
  handleCancel,
  handleOk,
  moods,
  selectedDay,
  selectedMonth,
  currentYear,
  setDays,
  setCreateDayMoodLoading,
  createDayMoodLoading,
}) => {
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
    setCreateDayMoodLoading(false);
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

  return (
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
  );
};

export default MoodModal;
