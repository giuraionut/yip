import { Mood } from '@prisma/client';
import React, { useState, useEffect } from 'react';

export function Moods() {
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

  return moods;
}
