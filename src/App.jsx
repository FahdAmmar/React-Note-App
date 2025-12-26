
import NoteMain from "./components/NoteMain.jsx"
import './App.css'

import { useState, useEffect } from 'react';
import MainContext from './ContextFolder/MainContext.jsx';


const info = [
  {
    id: 1,
    title: "Sample Note 1",
    content: "This is the content of sample note 1.",
    complated: false
  },
  {
    id: 2,
    title: "Sample Note 2",
    content: "This is the content of sample note 2.",
    complated: false

  },
  {
    id: 3,
    title: "Sample Note 3",
    content: "This is the content of sample note 3.",
    complated: false

  },
  {
    id: 4,
    title: "Sample Note 4",
    content: "This is the content of sample note 4.",
    complated: false

  }, {
    id: 5,
    title: "Sample Note 5",
    content: "This is the content of sample note 5.",
    complated: false

  }
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