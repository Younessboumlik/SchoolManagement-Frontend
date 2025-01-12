import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Grid, Card, CardContent, Typography } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MyBarChart = () => {
  const [top5Data, setTop5Data] = useState(null);
  const [bottom5Data, setBottom5Data] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8081/dashboard/getBestModules');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        processDataForCharts(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setError("Failed to fetch data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const processDataForCharts = (apiData) => {
    if (!apiData || apiData.length === 0) {
      console.warn("No data received from the API");
      return;
    }

    // Ensure we have at least 5 elements for each category
    const top5 = apiData.slice(0, 5);
    const bottom5 = apiData.slice(5, 10);

    // Create chart data for top 5 modules (green bars)
    setTop5Data(createChartData(top5, "green", "Top 5 Modules"));
    // Create chart data for bottom 5 modules (red bars)
    setBottom5Data(createChartData(bottom5, "red", "Bottom 5 Modules"));
  };

  const createChartData = (data, backgroundColor, label) => {
    const labels = data.map((item) => item.nomModule);
    const dataValues = data.map((item) => item.moyenne);

    return {
      labels: labels,
      datasets: [
        {
          label: label,
          data: dataValues,
          backgroundColor: backgroundColor,
        },
      ],
    };
  };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false, // Disable aspect ratio to control height
        plugins: {
            legend: { display: false },
            tooltip: {
                callbacks: {
                    label: (context) =>
                        `${context.label} : ${context.raw}`,
                },
            },
        },
      scales: {
          y: {
              title: { display: true, text: "Modules" },
          },
          x: {
              title: { display: true, text: "Moyennes" },
              min: 0,
              max: 20,
          },
      },
    };
  if (loading) {
      return <p>Chargement des données...</p>; // French loading text
  }

  if (error) {
    return <p>Erreur: {error}</p>; // French error message
  }

   return (
     <Grid container spacing={2}>
       {top5Data && (
         <Grid item xs={12} md={6}>
           <Card>
             <CardContent>
               <Typography variant="h6" gutterBottom>
                 Meilleurs 5 Modules
               </Typography>
               <div style={{ height: '300px' }}>
               <Bar data={top5Data} options={{ ...chartOptions, maintainAspectRatio: false}}/>
               </div>
             </CardContent>
           </Card>
         </Grid>
       )}
       {bottom5Data && (
         <Grid item xs={12} md={6}>
           <Card>
             <CardContent>
               <Typography variant="h6" gutterBottom>
                 Moins Bons 5 Modules
               </Typography>
               <div style={{ height: '300px' }}>
                   <Bar data={bottom5Data} options={{...chartOptions, maintainAspectRatio: false}}/>
               </div>
             </CardContent>
           </Card>
         </Grid>
       )}
     </Grid>
   );

};

export default MyBarChart;