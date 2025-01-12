import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
} from 'chart.js';

// Register the required components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale
);

const FilierePieChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8081/dashboard/getFiliereData")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des données");
        }
        return response.json();
      })
      .then((data) => {
        const labels = data.map((filiere) => filiere.nomFiliere);
        const studentCounts = data.map((filiere) => filiere.studentCount);

        setChartData({
          labels: labels,
          datasets: [
            {
              label: "Répartition des étudiants par filière",
              data: studentCounts,
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
              ],
              hoverOffset: 4,
            },
          ],
        });
      })
      .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
      });
  }, []);

  return (
    <div style={{ width: "50%", margin: "0 auto" }}>
      <h3>Répartition des étudiants par filière</h3>
      {chartData ? (
        <Pie
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top",
              },
              tooltip: {
                callbacks: {
                  label: function (context) {
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = ((context.raw / total) * 100).toFixed(2);
                    return `${context.label}: ${context.raw} étudiants (${percentage}%)`;
                  },
                },
              },
            },
          }}
        />
      ) : (
        <p>Chargement des données...</p>
      )}
    </div>
  );
};

export default FilierePieChart;