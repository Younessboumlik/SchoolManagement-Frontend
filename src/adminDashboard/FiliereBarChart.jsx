import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import { BarChart } from '@mui/x-charts/BarChart';

export default function BarAnimation() {
  const [series, setSeries] = useState([]);
  const [xAxisData, setXAxisData] = useState([]); // X-axis data (names of filieres)

  useEffect(() => {
    // Fetch data from the new API
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8081/dashboard/getFiliereData');
        const data = await response.json();

        console.log("Fetched data:", data); // Debugging: Log data from API

        // Map data to BarChart format
        const transformedSeries = [
          {
            label: 'Number of Students',
            data: data.map((filiere) => filiere.studentCount || 0), // Default to 0 if undefined
            color: '#4caf50', // Green for students
          },
          {
            label: 'Number of Modules',
            data: data.map((filiere) => filiere.moduleCount || 0), // Default to 0 if undefined
            color: '#ff9800', // Orange for modules
          },
        ];

        // Extract `nomFiliere` for X-axis
        const transformedXAxisData = data.map((filiere) => filiere.nomFiliere);

        setSeries(transformedSeries);
        setXAxisData(transformedXAxisData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ width: '100%' }}>
      <h3>Répartition des étudiants par filière</h3>
      <BarChart
        height={400}
        width={600}
        xAxis={[{ scaleType: 'band', data: xAxisData }]} // Use filiere names for X-axis
        series={series} // Provide both series (students and modules)
        barCategoryGap="20%" // Add spacing between bar groups
        barWidth={40} // Customize bar width
        animation // Enable animation
      />
    </Box>
  );
}
