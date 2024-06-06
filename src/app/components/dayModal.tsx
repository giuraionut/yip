import React, { useEffect, useRef, useState } from 'react';
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
  theme,
  message,
  AutoComplete,
} from 'antd';
import { Mood, DayMood, Event, DayEvent } from '@prisma/client';
import { IDay, MyDayEvent, MyDayMood } from '../types/interfaces';
import {
  MinusOutlined,
  PlusOutlined,
  CloseOutlined,
  SmileOutlined,
} from '@ant-design/icons';
import type { PopconfirmProps } from 'antd';
import { currentMonthName } from './monthSelector';
import EmojiPicker, { EmojiClickData, Theme } from 'emoji-picker-react';
import { dayChangeNotification } from './notifications';
import { hexToRgb } from '../utils';

const DayModal: React.FC<{
  isModalOpen: boolean;
  handleCancel: () => void;
  handleOk: () => void;
  moods: Mood[];
  selectedDay: number;
  selectedMonth: number;
  currentYear: number;
  setMoods: React.Dispatch<React.SetStateAction<Mood[]>>;
  setEvents: React.Dispatch<React.SetStateAction<Event[]>>;
  setDays: React.Dispatch<React.SetStateAction<IDay[]>>;
  setCreateDayMoodLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setCreateDayEventLoading: React.Dispatch<React.SetStateAction<boolean>>;
  createDayMoodLoading: boolean;
  createDayEventLoading: boolean;
  moodsLoading: boolean;
  events: Event[];
}> = ({
  isModalOpen,
  handleCancel,
  handleOk,
  moods,
  selectedDay,
  selectedMonth,
  currentYear,
  setMoods,
  setEvents,
  setDays,
  setCreateDayMoodLoading,
  setCreateDayEventLoading,
  createDayMoodLoading,
  createDayEventLoading,
  moodsLoading,
  events,
}) => {
  const [api, contextHolder] = notification.useNotification();
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [colorPickerValue, setColorPickerValue] = useState('rgb(251 146 150)');
  const [emojiPickerEmoji, setEmojiPickerEmoji] = useState<EmojiClickData>();
  const [eventOptions, setEventOptions] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event>();
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
          if (day && day.index === selectedDay) {
            return { ...day, mood: newDayMood.mood };
          }
          return day;
        })
      );
      setCreateDayMoodLoading(false);
      dayChangeNotification(
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
        'Mood created succesfully!',
        api
      );
    } catch (error) {
      console.error('Error creating mood:', error);
      dayChangeNotification(
        'topRight',
        "For some reason the mood can't be created, try again later...",
        'Creating mood failed',
        api
      );
    }
  };

  const createDayEvent = async (data: DayEvent) => {
    try {
      const response = await fetch('/api/dayevent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create day mood');
      const newDayEvent: MyDayEvent = await response.json();
      setDays((prevDays) =>
        prevDays.map((day) => {
          if (day && day.index === selectedDay) {
            return { ...day, event: newDayEvent.event };
          }
          return day;
        })
      );
      setCreateDayMoodLoading(false);
      dayChangeNotification(
        'topRight',
        <>
          <span>Today, you set your mood as: </span>
          {newDayEvent.event.name}
        </>,
        'Event created succesfully!',
        api
      );
    } catch (error) {
      console.error('Error creating event:', error);
      dayChangeNotification(
        'topRight',
        "For some reason the event can't be created, try again later...",
        'Creating event failed',
        api
      );
    }
  };
  const createNewMoodTag = async (moodName: string) => {
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
        dayChangeNotification(
          'topRight',
          `You created a new mood tag: ${moodName}`,
          'Mood tag created successfully',
          api
        );
        return data;
      } else {
        throw new Error('Failed to fetch moods');
      }
    } catch (error) {
      console.log(error);
      dayChangeNotification(
        'topRight',
        `For some reason, creating ${moodName} mood tag failed...`,
        'Creating mood tag failed',
        api
      );
      return undefined;
    }
  };

  const deleteMoodTag = async (mood: Mood) => {
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
        dayChangeNotification(
          'topRight',
          <>
            <span>Deleting the mood tag </span>
            <Tag color={mood.color ? mood.color : ''} key={mood.id}>
              {mood.name}
            </Tag>
            <span>failed. Reason: {errorData.message}</span>
          </>,
          'Deleting mood tag failed',
          api
        );
        throw new Error(errorData.message || 'Failed to delete mood');
      }
      console.log('Mood deleted successfully');
      const newMoods = moods.filter((m) => m.id !== mood.id);
      setMoods(newMoods);
      dayChangeNotification(
        'topRight',
        `The mood tag "${mood.name}" was deleted with success!`,
        'Mood tag deleted successfully!',
        api
      );
    } catch (error) {
      console.error('Error deleting mood:', error);
    }
  };
  const resetDayEvent = async () => {
    try {
      const response = await fetch('/api/dayevent', {
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
            if (day && day.index === selectedDay) {
              return { ...day, event: undefined };
            }
            return day;
          })
        );
        dayChangeNotification(
          'topRight',
          `Event for ${selectedDay} of ${currentMonthName(
            selectedMonth
          )} was reseted successfully!`,
          'Event deleted succesfully',
          api
        );
        console.log('Event deleted successfully');
      } else {
        dayChangeNotification(
          'topRight',
          "For some reason the event can't be deleted, try again later...",
          'Deleting event failed',
          api
        );
        console.error('Failed to delete event');
      }
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };
  const resetDayMood = async () => {
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
        dayChangeNotification(
          'topRight',
          `Mood for ${selectedDay} of ${currentMonthName(
            selectedMonth
          )} was reseted successfully!`,
          'Mood deleted succesfully',
          api
        );
        console.log('Mood deleted successfully');
      } else {
        dayChangeNotification(
          'topRight',
          "For some reason the mood can't be deleted, try again later...",
          'Deleting mood failed',
          api
        );
        console.error('Failed to delete mood');
      }
    } catch (error) {
      console.error('Error deleting mood:', error);
    }
  };

  const createEvent = async (event: Event) => {
    try {
      const response = await fetch('/api/event', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json', // Set the content type to JSON
        },
        body: JSON.stringify({ name: event.name, symbol: event.symbol }),
      });
      if (response.ok) {
        const data: Event = await response.json();
        console.log(data);
        dayChangeNotification(
          'topRight',
          `You created a new event: ${event.name}`,
          'Event created successfully',
          api
        );
        return data;
      } else {
        throw new Error('Failed to fetch events');
      }
    } catch (error) {
      console.log(error);
      dayChangeNotification(
        'topRight',
        `For some reason, creating ${event.name} event failed...`,
        'Creating event failed',
        api
      );
      return undefined;
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

  const handleCreateDayEvent = async (event: Event) => {
    setCreateDayEventLoading(true);
    const dayEvent: DayEvent = {
      day: selectedDay,
      month: selectedMonth,
      year: currentYear,
      eventId: event.id,
    };
    await createDayEvent(dayEvent);
    setCreateDayEventLoading(false);
  };
  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, [inputVisible]);

  const handleDeleteMoodTag = async (removedMood: Mood) => {
    await deleteMoodTag(removedMood);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = async () => {
    if (inputValue && !moods.some((mood) => mood.name === inputValue)) {
      const newMood = await createNewMoodTag(inputValue);
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
            handleDeleteMoodTag(mood);
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
      }}
      onClick={() => handleCreateDayMood(mood)}
      className='hover:cursor-pointer hover:brightness-125'
    >
      {mood.name}
    </Tag>
  ));

  const confirm: PopconfirmProps['onConfirm'] = (e) => {
    console.log(e);
    message.success('Click on Yes');
  };

  const getPanelValue = (searchText: string) => {
    if (!searchText) {
      return [];
    }
    return events.filter((event: Event) =>
      event.name.toLowerCase().includes(searchText.toLowerCase())
    );
  };
  const cancel: PopconfirmProps['onCancel'] = (e) => {
    console.log(e);
    message.error('Click on No');
  };
  const onEventSelect = (event: Event) => {
    setSelectedEvent(event);
    handleCreateDayEvent(event);
    console.log(event);
  };
  const onInputChange = (value: string) => {
    setInputValue(value);
    setSelectedEvent(undefined);
    setEmojiPickerEmoji(undefined);
  };

  const handleDeleteEvent = async (event: Event) => {
    console.log('delete', event);
    deleteEvent(event);
  };

  const deleteEvent = async (event: Event) => {
    try {
      const response = await fetch('/api/event', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: event.id }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        dayChangeNotification(
          'topRight',
          <>
            <span>Deleting the event </span>
            {event.name}
            <span>failed. Reason: {errorData.message}</span>
          </>,
          'Deleting event failed',
          api
        );
        throw new Error(errorData.message || 'Failed to delete event');
      }
      console.log('Event deleted successfully');
      const newEvents = events.filter((e) => e.id !== event.id);
      setEvents(newEvents);
      dayChangeNotification(
        'topRight',
        `The event "${event.name}" was deleted with success!`,
        'Event deleted successfully!',
        api
      );
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleEnterPress = async () => {
    if (!inputValue) return;

    const selectedOption = eventOptions.find(
      (event) => event.name === inputValue
    );
    if (selectedOption) return;

    console.log('Entered:', inputValue);
    const event: Event = {
      name: inputValue,
      symbol: emojiPickerEmoji ? emojiPickerEmoji.emoji : '',
    } as Event;
    const newEvent = await createEvent(event);
    if (newEvent) {
      const existingEventIndex = events.findIndex(
        (event) => event.name === newEvent.name
      );

      if (
        existingEventIndex === -1 ||
        (!events[existingEventIndex].symbol && newEvent.symbol)
      ) {
        setEvents(
          existingEventIndex === -1
            ? [...events, newEvent]
            : events.map((event, index) =>
                index === existingEventIndex ? newEvent : event
              )
        );
      }
    }

    // handleCreateDayEvent(event);
  };

  const renderEvent = (event: Event) => ({
    value: event.name,
    event: event,
    label: (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {event.name} {event.symbol}
        <span>
          <Popconfirm
            title='Are you sure to delete this event?'
            onConfirm={(e) => {
              if (e) {
                e.preventDefault();
                e.stopPropagation();
              }
              handleDeleteEvent(event);
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
            <MinusOutlined
              onClick={(e) => {
                e.stopPropagation();
                console.log('minus');
              }}
            />
          </Popconfirm>
        </span>
      </div>
    ),
  });

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
          <Button key='resetDayMood' onClick={resetDayMood} type='primary'>
            Reset Day Mood
          </Button>,
          <Button key='resetDayEvent' onClick={resetDayEvent} type='primary'>
            Reset Day Event
          </Button>,
        ]}
      >
        <span className='font-bold'>Set the day mood</span>
        <Flex gap='10px' vertical>
          <Flex gap='5px' wrap className='pt-2'>
            {moodTags}
          </Flex>
          {createDayMoodLoading ? <Spin /> : ''}

          <Flex gap='10px' wrap vertical>
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
              <Flex gap='10px' wrap>
                <ColorPicker
                  size='small'
                  defaultValue={colorPickerValue}
                  onChange={(_, hex) => {
                    setColorPickerValue(hexToRgb(hex));
                  }}
                />
                <Tag
                  onClick={showInput}
                  color={colorPickerValue}
                  icon={<PlusOutlined />}
                >
                  New Tag
                </Tag>
              </Flex>
            )}

            <span className='font-bold'>Create new Event</span>
            <Flex gap='10px' wrap>
              <AutoComplete
                options={eventOptions.map(renderEvent)}
                style={{ width: 200 }}
                onSelect={(value, option) => onEventSelect(option.event)}
                onSearch={(text) => setEventOptions(getPanelValue(text))}
                onChange={onInputChange}
              >
                <Input
                  size='large'
                  placeholder='Create/Select Event'
                  onPressEnter={handleEnterPress}
                  addonAfter={
                    <Popconfirm
                      title='Pick an emoji'
                      onPopupClick={(e) => e.stopPropagation()}
                      description={
                        <div onMouseDown={(e) => e.stopPropagation()}>
                          <EmojiPicker
                            theme={Theme.DARK}
                            autoFocusSearch={true}
                            lazyLoadEmojis={true}
                            onEmojiClick={(emoji) => setEmojiPickerEmoji(emoji)}
                          />
                        </div>
                      }
                      onConfirm={confirm}
                      onCancel={() => setEmojiPickerEmoji(undefined)}
                      okText=''
                      cancelText=''
                      icon=''
                    >
                      {emojiPickerEmoji ? (
                        emojiPickerEmoji.emoji
                      ) : selectedEvent?.symbol ? (
                        selectedEvent.symbol
                      ) : (
                        <SmileOutlined />
                      )}
                    </Popconfirm>
                  }
                />
              </AutoComplete>
            </Flex>
          </Flex>
        </Flex>
      </Modal>
    </>
  );
};

export default DayModal;
