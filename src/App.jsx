import { useState } from 'react';
import { AppProvider } from './dataprovider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './login';
import './App.css';
import ProfTable from './tabledeprofesseur';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import SidebarAdmin from './SidebarAdmin/SidebarAdmin';
import FiliereTable from './tableFiliere/TableFiliere';
import ModEvalTable from './tableModEval/tableModEval';
import TableProfElement from './tableProfElement/tableProfElement';

const LayoutWithSidebar = ({ children }) => {
  return (
    <div style={{ display: 'flex' }}>
      <SidebarAdmin />
      <div className="main-content" style={{ flex: 1, padding: '20px' }}>
        {children}
      </div>
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Login route without sidebar */}
          <Route path="/login" element={<Login />} />

          {/* Routes with sidebar */}
          <Route
            path="/prof"
            element={
              <LayoutWithSidebar>
                <ProfTable />
               </LayoutWithSidebar>
            }
          />


          <Route
            path="/modeval"
            element={
              <LayoutWithSidebar>
                <ModEvalTable />
               </LayoutWithSidebar>
            }
          />

          <Route
            path="/filiere"
            element={
              <LayoutWithSidebar>
                <FiliereTable />
               </LayoutWithSidebar>
            }
          />

            <Route
            path="/profelement"
            element={
              <LayoutWithSidebar>
                <TableProfElement />
               </LayoutWithSidebar>
            }
          />
          
          <Route
            path="/sidebar"
            element={
              <LayoutWithSidebar>
                <div>Sidebar Page</div>
              </LayoutWithSidebar>
            }
          />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
