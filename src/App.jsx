import { useState } from 'react'
import { AppProvider } from './dataprovider'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import Login from './login'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <AppProvider>
    <BrowserRouter>

    <Routes>
      <Route path='/login' element = {<Login></Login>}></Route>
    </Routes>
    </BrowserRouter>
    </AppProvider>
    </>
  )
}

export default App
