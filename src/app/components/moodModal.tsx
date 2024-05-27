import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  Tag,
  Flex,
  Button,
  Spin,
  InputRef,
  theme,
  Input,
  ColorPicker,
  notification,
} from 'antd';
import { Mood, DayMood } from '@prisma/client';
import { IDay, MyDayMood } from '../types/interfaces';
import { PlusOutlined, RadiusUprightOutlined } from '@ant-design/icons';
import type { NotificationArgsProps } from 'antd';
import { currentMonthName } from './monthSelector';

type NotificationPlacement = NotificationArgsProps['placement'];
const MoodModal: React.FC<{
  isModalOpen: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  moods: Mood[];
  selectedDay: number;
  selectedMonth: number;
  currentYear: number;
  setMoods: React.Dispatch<React.SetStateAction<Mood[]>>;
  setDays: React.Dispatch<React.SetStateAction<IDay[]>>;
  setCreateDayMoodLoading: React.Dispatch<React.SetStateAction<boolean>>;
  createDayMoodLoading: boolean;
  moodsLoading: boolean;
}> = ({
  isModalOpen,
  handleCancel,
  handleOk,
  moods,
  selectedDay,
  selectedMonth,
  currentYear,
  setDays,
  setMoods,
  setCreateDayMoodLoading,
  createDayMoodLoading,
  moodsLoading,
}) => {
  const [api, contextHolder] = notification.useNotification();

  const { token } = theme.useToken();
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<InputRef>(null);
  const [colorPickerValue, setColorPickerValue] = useState('rgb(251 146 150)');
  const moodNotification = (
    placement: NotificationPlacement,
    description: string,
    message: string
  ) => {
    api.info({
      message: message,
      description: description,
      placement,
    });
  };
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
      moodNotification(
        'topRight',
        `Today, you set your mood as ${newDayMood.mood.name}`,
        'Mood created succesfully!'
      );
    } catch (error) {
      console.error('Error creating mood:', error);
      moodNotification(
        'topRight',
        "For some reason the mood can't be created, try again later...",
        'Creating mood failed'
      );
    }
  };

  const createNewMood = async (moodName: string) => {
    try {
      const response = await fetch('/api/mood', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json', // Set the content type to JSON
        },
        body: JSON.stringify({ name: moodName, color: colorPickerValue }),
      });
      if (response.ok) {
        const data: Mood = await response.json();
        console.log(data);
        moodNotification(
          'topRight',
          `You created a new mood tag: ${moodName}`,
          'Mood tag created successfully'
        );
        return data;
      } else {
        throw new Error('Failed to fetch moods');
      }
    } catch (error) {
      console.log(error);
      moodNotification(
        'topRight',
        `For some reason, creating ${moodName} mood tag failed...`,
        'Creating mood tag failed'
      );
      return undefined;
    }
  };

  const deleteMood = async (mood: Mood) => {
    try {
      const response = await fetch('/api/mood', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: mood.id }),
      });
      if (!response.ok) {
        throw new Error('Failed to delete mood');
      }
      console.log('Mood deleted successfully');
      moodNotification(
        'topRight',
        `The mood tag "${mood.name}" was deleted with success!`,
        'Mood tag deleted successfully!'
      );
    } catch (error) {
      console.error('Error deleting mood:', error);
      moodNotification(
        'topRight',
        `For some reason, deleting the mood tag "${mood.name}" failed...`,
        'Deleting mood tag failed'
      );
    }
  };
  const handleCreateDayMood = async (mood: Mood) => {
    setCreateDayMoodLoading(true);
    const dayMood: DayMood = {
      day: selectedDay,
      month: selectedMonth,
      year: currentYear,
      moodId: mood.id,
    };
    await createDayMood(dayMood);
    setCreateDayMoodLoading(false);
    // handleOk();
  };

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  const handleClose = async (removedMood: Mood) => {
    const newMoods = moods.filter((mood) => mood.id !== removedMood.id);
    console.log(newMoods);
    await deleteMood(removedMood);
    setMoods(newMoods);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = async () => {
    if (inputValue && !moods.some((mood) => mood.name === inputValue)) {
      const newMood = await createNewMood(inputValue);
      if (newMood) {
        setMoods([...moods, newMood]);
      }
    }
    setInputVisible(false);
    setInputValue('');
  };

  const moodTags = moods.map((mood) => (
    <Tag
      color={mood.color ? mood.color : ''}
      key={mood.id}
      closable
      onClose={(e) => {
        e.preventDefault();
        handleClose(mood);
      }}
      onClick={() => handleCreateDayMood(mood)}
      className='hover:cursor-pointer font-bold hover:brightness-125'
    >
      {mood.name}
    </Tag>
  ));

  const resetMood = async () => {
    try {
      const response = await fetch('/api/daymood', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          day: selectedDay,
          month: selectedMonth,
          year: currentYear,
        }),
      });

      if (response.ok) {
        setDays((prevDays) =>
          prevDays.map((day) => {
            return day.index === selectedDay
              ? { ...day, mood: undefined }
              : day;
          })
        );
        moodNotification(
          'topRight',
          `Mood for ${selectedDay} of ${currentMonthName(
            selectedMonth
          )} was reseted successfully!`,
          'Mood deleted succesfully'
        );
        console.log('Mood deleted successfully');
      } else {
        moodNotification(
          'topRight',
          "For some reason the mood can't be deleteMood, try again later...",
          'Deleting mood failed'
        );
        console.error('Failed to delete mood');
      }
    } catch (error) {
      console.error('Error deleting mood:', error);
    }
  };

  const hexToRgb = (hex: string) => {
    // Remove the leading '#' if present
    hex = hex.replace(/^#/, '');

    // Parse the r, g, b values from the hex string
    let bigint = parseInt(hex, 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;

    return `rgb(${r} ${g} ${b})`;
  };

  return (
    <>
      {contextHolder}
      <Modal
        title='How was your day?'
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[
          <Button key='closeModal' onClick={handleCancel} type='primary'>
            Close
          </Button>,
          <Button key='resetMood' onClick={resetMood} type='primary'>
            Reset Mood
          </Button>,
        ]}
      >
        <Flex gap='10px' vertical>
          <Flex gap='5px' wrap>
            {moodTags}
          </Flex>
          {createDayMoodLoading ? <Spin /> : ''}
          {inputVisible ? (
            <Input
              ref={inputRef}
              type='text'
              size='small'
              style={{ width: 78 }}
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
            />
          ) : (
            <Flex gap='10px' wrap>
              <ColorPicker
                size='small'
                defaultValue={colorPickerValue}
                onChange={(_, hex) => {
                  setColorPickerValue(hexToRgb(hex));
                }}
              />
              <Tag onClick={showInput} color={colorPickerValue}>
                <PlusOutlined /> New Tag
              </Tag>
            </Flex>
          )}
        </Flex>
      </Modal>
    </>
  );
};

export default MoodModal;
