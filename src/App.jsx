import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
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
