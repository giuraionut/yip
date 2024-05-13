import { DayMood, Mood } from '@prisma/client';
import { useState, useEffect } from 'react';

interface MyDayMood extends DayMood {
  mood: Mood;
}

export function DaysMood() {
  const [dayMoods, setDayMoods] = useState<MyDayMood[]>([]); // Annotate moods as Mood[]

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

          setDayMoods(data);
        } else {
          throw new Error('Failed to fetch day moods');
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchDayMoods();
  }, []);

  return dayMoods;
}
