
import NoteMain from "./components/NoteMain.jsx"
import './App.css'
import { useState } from 'react';
import MainContext from './ContextFolder/MainContext.jsx';






function App() {
  const [notes, setNotes] = useState([
    {
      id: 1,
      title: "Sample Note 1",
      content: "This is the content of sample note 1.",
      completed: false,
      time: ""
    },
    {
      id: 2,
      title: "Sample Note 2",
      content: "This is the content 2.",
      completed: false,
      time: ""
    },
    {
      id: 3,
      title: "Sample Note 3",
      content: "This is the content of samp3.",
      completed: false,
      time: ""
    },
    {
      id: 4,
      title: "Sample Note 4",
      content: "This is the content of sample note 4.",
      completed: false,
      time: ""
    },

  ]);

  return (
    <>
      <MainContext.Provider value={{ notes, setNotes }}>
        <NoteMain />
      </MainContext.Provider>
    </>
  )
}
export default App