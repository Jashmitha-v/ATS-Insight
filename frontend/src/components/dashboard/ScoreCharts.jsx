import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

import GlassCard from "../common/GlassCard.jsx";

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const CHART_COLORS = ["#7C3AED", "#2563EB", "#34D399", "#FBBF24", "#F87171", "#A78BFA", "#60A5FA"];

const sharedOptions = {
  responsive: true,
  plugins: {
    legend: {
      labels: { color: "#D1D5DB", font: { size: 11 } },
    },
  },
};

export default function ScoreCharts({ subScores }) {
  const labels = Object.keys(subScores).map((k) => k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()));
  const values = Object.values(subScores);

  const barData = {
    labels,
    datasets: [
      {
        label: "Score",
        data: values,
        backgroundColor: CHART_COLORS,
        borderRadius: 8,
      },
    ],
  };

  const pieData = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: CHART_COLORS,
        borderColor: "#0B0F19",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <GlassCard className="p-6">
        <h3 className="text-white font-semibold mb-4 text-sm">Score Breakdown</h3>
        <Bar
          data={barData}
          options={{
            ...sharedOptions,
            scales: {
              x: { ticks: { color: "#9CA3AF" }, grid: { color: "#1F2937" } },
              y: { ticks: { color: "#9CA3AF" }, grid: { color: "#1F2937" }, max: 100 },
            },
            plugins: { ...sharedOptions.plugins, legend: { display: false } },
          }}
        />
      </GlassCard>
      <GlassCard className="p-6">
        <h3 className="text-white font-semibold mb-4 text-sm">Category Distribution</h3>
        <Pie data={pieData} options={sharedOptions} />
      </GlassCard>
    </div>
  );
}
