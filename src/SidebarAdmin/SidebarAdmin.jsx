import React, { useState } from 'react';
import './SidebarAdmin.css'; 
import '@fortawesome/fontawesome-free/css/all.min.css';



const SidebarAdmin = () => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <>
    <div
      className={`sidebar ${isHovered ? 'expanded' : 'collapsed'}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="sidebar-header">
        <h3 className="brand">
          <span class="title-sidebar">Espace Administrateur</span>
        </h3>
      </div>
      <ul className="nav-links">
        <li>
          <a href="/prof" className="nav-item">
            <span className="nav-icon"><i className="fas fa-chalkboard-teacher"></i></span>
            <span>Professeur</span>
          </a>
        </li>
        <li>
          <a href="#" className="nav-item">
            <span className="nav-icon"><i className="fas fa-user-graduate"></i></span>
            <span>Filiere</span>
          </a>
        </li>
        <li>
          <a href="#" className="nav-item">
            <span className="nav-icon"><i className="fa-solid fa-book-open"></i></span>
            <span>Module et elements</span>
          </a>
        </li>
        <li>
          <a href="#" className="nav-item">
            <span className="nav-icon"><i className="fa-solid fa-clipboard-check"></i></span>
            <span>Modalite d'evaluation</span>
          </a>
        </li>
        <li>
          <a href="#" className="nav-item">
            <span className="nav-icon"><i className="fa-solid fa-user-cog"></i></span>
            <span>Affectation des prof</span>
          </a>
        </li>
        <li>
          <a href="#" className="nav-item">
            <span className="nav-icon"><i class="fa-solid fa-user-circle"></i></span>
            <span>Compte utilisateur</span>
          </a>
        </li>


        {/* <li className="dropdown">
          <a href="#" className="nav-item dropdown-toggle">
            <span className="nav-icon"><i className="fas fa-cogs"></i></span>
            <span>Settings</span>
          </a>
          <ul className="dropdown-menu">
            <li><a href="#" className="dropdown-item">General</a></li>
            <li><a href="#" className="dropdown-item">Privacy</a></li>
            <li><a href="#" className="dropdown-item">Notifications</a></li>
          </ul>
        </li> */}
      </ul>
    </div>
    </>
  );
};

export default SidebarAdmin;
