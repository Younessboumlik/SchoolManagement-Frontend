import { useState } from 'react'
import { AppProvider } from './dataprovider'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Login from './login'
import './App.css'
import ProfTable from './tabledeprofesseur'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import SidebarAdmin from './SidebarAdmin/SidebarAdmin'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <AppProvider>
    <BrowserRouter>

    <Routes>
      <Route path='/login' element = {<Login></Login>}></Route>
      <Route path='/prof' element = {<ProfTable></ProfTable>}></Route>
      <Route path='/sidebar' element = {<SidebarAdmin></SidebarAdmin>}></Route>
    </Routes>
    </BrowserRouter>
    </AppProvider>
    </>
  )
}

export default App
