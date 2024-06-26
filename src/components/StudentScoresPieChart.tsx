// StudentScoresPieChart.tsx
import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale
);

interface StudentScoresPieChartProps {
  scores: { testTitle: string; score: number }[];
}

const StudentScoresPieChart: React.FC<StudentScoresPieChartProps> = ({
  scores,
}) => {
  const data = {
    labels: scores.map((score) => score.testTitle),
    datasets: [
      {
        data: scores.map((score) => score.score),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
        ],
        hoverBackgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
        ],
      },
    ],
  };

  return <Pie data={data} />;
};

export default StudentScoresPieChart;
