import React, { useEffect, useRef, useState } from 'react';
import { Modal, Tag, Flex, Button, Spin, InputRef, theme, Input } from 'antd';
import { Mood, DayMood } from '@prisma/client';
import { IDay, MyDayMood } from '../types/interfaces';
import { PlusOutlined } from '@ant-design/icons';

const SetMoodModal: React.FC<{
  isModalOpen: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  moods: Mood[];
  tags: string[];
  selectedDay: number;
  selectedMonth: number;
  currentYear: number;
  setTags: React.Dispatch<React.SetStateAction<string[]>>;

  setDays: React.Dispatch<React.SetStateAction<IDay[]>>;
  setCreateDayMoodLoading: React.Dispatch<React.SetStateAction<boolean>>;
  createDayMoodLoading: boolean;
}> = ({
  isModalOpen,
  handleCancel,
  handleOk,
  moods,
  tags,
  selectedDay,
  selectedMonth,
  currentYear,
  setTags,
  setDays,
  setCreateDayMoodLoading,
  createDayMoodLoading,
}) => {
  const { token } = theme.useToken();
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<InputRef>(null);
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

  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag) => tag !== removedTag);
    console.log(newTags);
    setTags(newTags);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
    }
    setInputVisible(false);
    setInputValue('');
  };

  const forMap = (tag: string) => (
    <Tag
      color={'red'}
      key={tag}
      closable
      onClose={(e) => {
        e.preventDefault();
        handleClose(tag);
      }}
      onClick={() => console.log(tag)}
    >
      {tag}
    </Tag>
  );

  const tagChild = tags.map(forMap);

  const tagPlusStyle: React.CSSProperties = {
    background: token.colorBgContainer,
    borderStyle: 'dashed',
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
          {tagChild}
        </Flex>
        {createDayMoodLoading ? <Spin /> : ''}
      </Flex>
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
        <Tag onClick={showInput} style={tagPlusStyle}>
          <PlusOutlined /> New Tag
        </Tag>
      )}
    </Modal>
  );
};

export default SetMoodModal;
