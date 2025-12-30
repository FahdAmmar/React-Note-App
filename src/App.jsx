
import NoteMain from "./components/NoteMain.jsx"
import './App.css'

import { useState, useEffect } from 'react';
import MainContext from './ContextFolder/MainContext.jsx';


const info = [
  {
    id: 1,
    title: "Sample Note 1",
    content: "This is the content of sample note 1.",
    complated: false,
    time:""
  },
 
]



function App() {
  const [notes, setNotes] = useState(info);








  return (
    <>
      <MainContext.Provider value={{ notes, setNotes }}>
        <NoteMain />
      </MainContext.Provider>
    </>
  )
}
export default App