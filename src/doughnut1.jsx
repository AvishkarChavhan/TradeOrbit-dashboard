import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut as DoughnutChart } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function Doughnut({ data }) {
  return <DoughnutChart data={data} />; 
}
