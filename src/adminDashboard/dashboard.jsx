import React from 'react';
import DashboardCard from './Cards.jsx';
import BarAnimation from './FiliereBarChart.jsx';
import MyBarChart from './BestandWorstModule.jsx';
import { Grid, Typography } from '@mui/material';
import FilierePieChart from './FilierePie.jsx';

const Dashboard = () => {
  return (
    <Grid container spacing={2} sx={{ padding: '20px' }}>
      {/* DashboardCard Section */}
      <Grid item xs={12}>
        <DashboardCard />
      </Grid>

      {/* BarAnimation and FilierePieChart Section */}
      <Grid item xs={6}>
        <BarAnimation />
      </Grid>
      <Grid item xs={6}>
        <FilierePieChart />
      </Grid>

      {/* MyBarChart Section */}
      <Grid item xs={12}>
        <Typography variant="h5" gutterBottom>
          Meilleurs et Pires Modules
        </Typography>
        <MyBarChart />
      </Grid>
    </Grid>
  );
};

export default Dashboard;
