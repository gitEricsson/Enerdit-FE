import React, { useState, useEffect } from 'react';
import LoadingSpinner from '../shared/LoadingSpinner';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const data = {
          title: 'Welcome to Enerdit',
          description:
            ' ENERDIT is designed to help users better understand and manage household energy consumption. By tracking appliances, analyzing usage patterns, and offering personalized recommendations, this tool empowers smarter energy choices.',
          energy_saving_tip:
            'Reducing energy consumption not only saves money but also plays a crucial role in conserving resources and protecting the environment.',
          environmental_impact:
            "Through mindful energy management, it's possible to lower carbon footprints and contribute to a more sustainable world—one kilowatt-hour at a time.",
        };
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!dashboardData) {
    return <div>No data available.</div>;
  }

  return (
    <div className="pl-4 pt-8 md:p-8">
      <h2 className="text-5xl mb-8">{dashboardData.title}</h2>
      <p className="mb-8 pt-8 pt-2 border-t-2 border-[#021405] inline-block">
        {dashboardData.description}
      </p>
      <p className="mb-8">{dashboardData.energy_saving_tip}</p>
      <p>{dashboardData.environmental_impact}</p>
    </div>
  );
};

export default Dashboard;
