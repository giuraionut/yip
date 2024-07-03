import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { IDay } from '../types/interfaces';
import { Mood } from '@prisma/client';
import { useTheme } from '../themeContext';
import { tailwindColors } from '../utils';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart: React.FC<{ days: IDay[] }> = ({ days }) => {
  const [doughnutData, setChartData] = useState<ChartData<'doughnut'>>();
  const [doughnutOptions, setChartOptions] =
    useState<ChartOptions<'doughnut'>>();
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
      const dOptions: ChartOptions<'doughnut'> = {
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
      const dData: ChartData<'doughnut'> = {
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
      setChartOptions(dOptions);
      setChartData(dData);
    }
  }, [days, darkMode]);

  return doughnutData && doughnutOptions ? (
    <div className='w-full max-w-md'>
      <Doughnut data={doughnutData} options={doughnutOptions} />
    </div>
  ) : null;
};

export default DoughnutChart;
