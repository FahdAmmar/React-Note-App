
import NoteMain from "./components/NoteMain.jsx"
import './App.css'
import { useState } from 'react';
import MainContext from './ContextFolder/MainContext.jsx';






function App() {
  const [notes, setNotes] = useState([]);


  return (
    <>
      <MainContext.Provider value={{ notes, setNotes }}>
        <NoteMain />
      </MainContext.Provider>
    </>
  )
}
export default App