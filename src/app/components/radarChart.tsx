import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  RadialLinearScale,
  Filler,
  LineElement,
  PointElement,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import { IDay } from '../types/interfaces';
import { Mood } from '@prisma/client';
import { useTheme } from '../themeContext';
import { tailwindColors } from '../utils';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const RadarChart: React.FC<{ days: IDay[] }> = ({ days }) => {
  const [radarOptions, setRadarOptions] = useState<ChartOptions<'radar'>>();
  const [radarData, setRadarData] = useState<ChartData<'radar'>>();
  const { accentColor, darkMode } = useTheme();

  useEffect(() => {
    if (days.length > 0) {
      const currentMonthMoods: Mood[] = days
        .map((day) => day?.mood)
        .filter((mood): mood is Mood => mood !== undefined);
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

      const rOptions: ChartOptions<'radar'> = {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
            align: 'start',
            labels: {
              color: darkMode ? tailwindColors.white : tailwindColors.black,
              font: {
                weight: 'normal',
                size: 14,
              },
            },
          },
        },
      };
      const rData: ChartData<'radar'> = {
        labels: labels,
        datasets: [
          {
            label: '# of Days',
            data: data,
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
          },
        ],
      };
      setRadarOptions(rOptions);
      setRadarData(rData);
    }
  }, [days, darkMode]);

  return radarData && radarOptions ? (
    <div className='w-full max-w-md'>
      <Radar data={radarData} options={radarOptions} />
    </div>
  ) : null;
};

export default RadarChart;
