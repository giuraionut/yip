import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Modal,
  Tag,
  Flex,
  Button,
  Spin,
  InputRef,
  Input,
  ColorPicker,
  notification,
  Popconfirm,
  Space,
  Select,
  theme,
  message,
} from 'antd';
import * as Icons from '@ant-design/icons';
import { Mood, DayMood } from '@prisma/client';
import { IDay, MyDayMood } from '../types/interfaces';
import {
  PlusOutlined,
  CloseOutlined,
  RadiusUprightOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import type { NotificationArgsProps, PopconfirmProps } from 'antd';
import { currentMonthName } from './monthSelector';
import EmojiPicker, { Theme } from 'emoji-picker-react';

type NotificationPlacement = NotificationArgsProps['placement'];
const DayModal: React.FC<{
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
    description: React.ReactNode,
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
        <>
          <span>Today, you set your mood as: </span>
          <Tag
            color={newDayMood.mood.color ? newDayMood.mood.color : ''}
            key={newDayMood.mood.id}
          >
            {newDayMood.mood.name}
          </Tag>
        </>,
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
        const errorData = await response.json();
        moodNotification(
          'topRight',
          <>
            <span>Deleting the mood tag </span>
            <Tag color={mood.color ? mood.color : ''} key={mood.id}>
              {mood.name}
            </Tag>
            <span>failed. Reason: ${errorData.message}</span>
          </>,
          'Deleting mood tag failed'
        );
        throw new Error(errorData.message || 'Failed to delete mood');
      }
      console.log('Mood deleted successfully');
      const newMoods = moods.filter((m) => m.id !== mood.id);
      setMoods(newMoods);
      moodNotification(
        'topRight',
        `The mood tag "${mood.name}" was deleted with success!`,
        'Mood tag deleted successfully!'
      );
    } catch (error) {
      console.error('Error deleting mood:', error);
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
    await deleteMood(removedMood);
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
      closeIcon={
        <Popconfirm
          title='Are you sure to delete this mood?'
          onConfirm={(e) => {
            if (e) {
              e.preventDefault();
              e.stopPropagation();
            }
            handleClose(mood);
          }}
          onCancel={(e) => {
            if (e) {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          okText='Yes'
          cancelText='No'
        >
          <CloseOutlined onClick={(e) => e.stopPropagation()} />
        </Popconfirm>
      }
      onClose={(e) => {
        e.preventDefault();
        // Prevent default close behavior
      }}
      onClick={() => handleCreateDayMood(mood)}
      className='hover:cursor-pointer hover:brightness-125'
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
  const handleEventInputChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  type IconComponentType = {
    [key: string]: React.ComponentType;
  };

  const confirm: PopconfirmProps['onConfirm'] = (e) => {
    console.log(e);
    message.success('Click on Yes');
  };

  const cancel: PopconfirmProps['onCancel'] = (e) => {
    console.log(e);
    message.error('Click on No');
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
              style={{ width: 100 }}
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputConfirm}
              onPressEnter={handleInputConfirm}
              placeholder='Mood name'
            />
          ) : (
            <Flex gap='10px' wrap vertical>
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
              <Flex gap='10px' wrap>
                <Space style={{ width: '100%' }}>
                  <Input
                    addonAfter={
                      <Popconfirm
                        title='Pick an emoji'
                        description={<EmojiPicker theme={Theme.DARK} />}
                        onConfirm={confirm}
                        onCancel={cancel}
                        okText=''
                        cancelText=''
                        icon=''
                      >
                        <SmileOutlined />
                      </Popconfirm>
                    }
                    placeholder='What happened today?'
                  />
                </Space>
              </Flex>
              <Popconfirm
                title='Delete the task'
                description='Are you sure to delete this task?'
                onConfirm={confirm}
                onCancel={cancel}
                okText='Yes'
                cancelText='No'
              >
                <Button danger>Delete</Button>
              </Popconfirm>
            </Flex>
          )}
        </Flex>
      </Modal>
    </>
  );
};

export default DayModal;
