import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  type TooltipItem,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useUser } from '../context/UserContext';
import './TemperatureChart.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface ChartDataPoint {
  label: string;
  temp: number;
}

interface TemperatureChartProps {
  data: ChartDataPoint[];
  title: string;
}

export function TemperatureChart({ data, title }: TemperatureChartProps) {
  const { t } = useUser();

  const chartData = {
    labels: data.map((d) => d.label),
    datasets: [
      {
        label: t('temperature'),
        data: data.map((d) => d.temp),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: title,
        color: 'var(--text-primary)',
        font: { size: 14, weight: 'normal' as const },
      },
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<'line'>) => `${ctx.parsed.y ?? 0}°C`,
        },
      },
    },
    scales: {
      x: {
        ticks: { color: 'var(--text-secondary)', maxRotation: 45 },
        grid: { color: 'var(--border-color)' },
      },
      y: {
        ticks: {
          color: 'var(--text-secondary)',
          callback: (value: string | number) => `${value}°`,
        },
        grid: { color: 'var(--border-color)' },
      },
    },
  };

  return (
    <div className="temperature-chart">
      <Line data={chartData} options={options} />
    </div>
  );
}
