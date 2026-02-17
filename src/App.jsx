import './App.css'
import { useState } from 'react';
import ResponsiveDrawer from "./components/ResponsiveDrawer"
import MainContext from './ContextFolder/MainContext';


function App() {
  const [notes, setNotes] = useState([]);

  return (
    <>
      <MainContext.Provider value={{ notes, setNotes }}>
        <ResponsiveDrawer />
      </MainContext.Provider>
    </>
  )
}
export default App