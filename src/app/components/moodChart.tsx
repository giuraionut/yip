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

ChartJS.register(ArcElement, Tooltip, Legend);

const MoodChart: React.FC<{ days: IDay[] }> = ({ days }) => {
  const [chartData, setChartData] = useState<ChartData<'doughnut'>>();
  const [chartOptions, setChartOptions] = useState<ChartOptions<'doughnut'>>();

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
      const options: ChartOptions<'doughnut'> = {
        responsive: true,
        plugins: {
          legend: {
            position: 'right',
            align: 'start',
            labels: {
              color: '#fff',
              font: {
                weight: 'normal',
                size: 14,
              },
            },
          },
        },
      };
      setChartOptions(options);
      const chartData: ChartData<'doughnut'> = {
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

      setChartData(chartData);
    }
  }, [days]);

  return chartData && chartOptions ? (
    <div className='w-full max-w-md'>
      <Doughnut data={chartData} options={chartOptions} />
    </div>
  ) : null;
};

export default MoodChart;
