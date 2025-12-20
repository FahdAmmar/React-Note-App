
import NoteMain from "./components/NoteMain.jsx"
import './App.css'

import { useState } from 'react';
import MainContext from './ContextFolder/MainContext.jsx';


const info=[
  {id:1,
  title:"Sample Note 1",
  content:"This is the content of sample note 1."
  },
  {
    id:2,
    title:"Sample Note 2",
    content:"This is the content of sample note 2."
    }, 
    {
      id:3,
      title:"Sample Note 3",
      content:"This is the content of sample note 3."
      },  
      {
        id:4,
        title:"Sample Note 4",
        content:"This is the content of sample note 4."
      },{
        id:5,
        title:"Sample Note 5",
        content:"This is the content of sample note 5." 
      }
 
   
]



function App() {
  const [notes,setNotes]=useState(info);


  return (
    <>
    <MainContext.Provider value={{notes,setNotes}}>
    <NoteMain/>
    </MainContext.Provider>
    </>
  )
}
export default App