// CorrectIncorrectPieChart.tsx
import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

interface CorrectIncorrectPieChartProps {
  correct: number;
  incorrect: number;
}

const CorrectIncorrectPieChart: React.FC<CorrectIncorrectPieChartProps> = ({
  correct,
  incorrect,
}) => {
  const data = {
    labels: ["Correct", "Incorrect"],
    datasets: [
      {
        data: [correct, incorrect],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  return <Pie data={data} />;
};

export default CorrectIncorrectPieChart;
