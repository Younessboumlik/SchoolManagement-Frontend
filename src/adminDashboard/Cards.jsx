// Cards.jsx
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Cards.css"; // Import custom CSS for styling

export const StatisticsCard = ({ color, icon, title, value, footer }) => {
  return (
    <div className={`stat-card border shadow-sm`} style={{ borderColor: color }}>
      <div
        className="stat-icon"
        style={{ backgroundColor: color, color: "white" }}
      >
        <i className={icon}></i>
      </div>
      <div className="stat-content">
        <p className="stat-title text-blue-gray-600">{title}</p>
        <h4 className="stat-value text-blue-gray">{value}</h4>
      </div>
      {footer && <div className="stat-footer border-t">{footer}</div>}
    </div>
  );
};

StatisticsCard.defaultProps = {
  color: "#1E88E5", // Default to Material Blue
  footer: null,
};

StatisticsCard.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  footer: PropTypes.node,
};

export const DashboardCard = () => {
  const [counts, setCounts] = useState({
    etudiants: 0,
    professeurs: 0,
    filieres: 0,
    modules: 0,
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        // Fetching data from the endpoints
        const responses = await Promise.all([
          fetch("http://localhost:8081/dashboard/getEtudiantCount"),
          fetch("http://localhost:8081/dashboard/getProfCount"),
          fetch("http://localhost:8081/dashboard/getFiliereCount"),
          fetch("http://localhost:8081/dashboard/getModuleCount"),
        ]);
        
        // Reading the responses as plain text
        const data = await Promise.all(responses.map((res) => res.text()));
  
        // Parsing the text data into integers and setting the state
        setCounts({
          etudiants: parseInt(data[0], 10),
          professeurs: parseInt(data[1], 10),
          filieres: parseInt(data[2], 10),
          modules: parseInt(data[3], 10),
        });
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };
  
    fetchCounts();
  }, []);
  

  return (
    <div className="dashboard-container">
      <StatisticsCard
        color="#1E88E5"
        icon="fas fa-user-graduate"
        title="Étudiants"
        value={counts.etudiants.toString()}
      />
      <StatisticsCard
        color="#43A047"
        icon="fas fa-chalkboard-teacher"
        title="Professeurs"
        value={counts.professeurs.toString()}
      />
      <StatisticsCard
        color="#F4511E"
        icon="fas fa-university"
        title="Filières"
        value={counts.filieres.toString()}
      />
      <StatisticsCard
        color="#6A1B9A"
        icon="fa-solid fa-book-open"
        title="Modules"
        value={counts.modules.toString()}
      />
    </div>
  );
};

export default DashboardCard;
