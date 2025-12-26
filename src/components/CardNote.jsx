import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CardActionArea from '@mui/material/CardActionArea';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';


import * as React from 'react';
import { useState, useContext } from 'react';
import MainContext from '../ContextFolder/MainContext.jsx';

import Checkbox from '@mui/material/Checkbox';

const label = { slotProps: { input: { 'aria-label': 'Checkbox demo' } } };








export default function CardNote({ note }) {
  const { notes, setNotes } = useContext(MainContext);


  function handleCheckedClick() {
    const update = notes.map((n) => {
      if (n.id === note.id) {
        return { ...n, complated: !n.complated }
      }
      return n
    })
    setNotes(update)
    localStorage.setItem("notes", JSON.stringify(update))


  }




  const handleDeletClick = () => {
    const updatedNotes = notes.filter((n) => n.id !== note.id);
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes))

  }



  return (
    <Card className= "w-full h-auto object-cover" sx={{ marginBottom: .5, marginTop: .5, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', borderRadius: '15px' }}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div" sx={{ textDecoration: note.complated ? 'line-through' : "" }}>
            {note.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', overflowY: "auto", maxHeight: "100px", textDecoration: note.complated ? 'line-through' : "" }} >
            {note.content}
          </Typography>
        </CardContent>
        <CardActions className=' h-10 flex justify-end items-end'>
          <IconButton aria-label="delete" size="large">
            <Checkbox {...label} defaultChecked color="success" checked={note.complated} onChange={handleCheckedClick} />
            <DeleteIcon className='text-red-700 hover:text-red-500' fontSize="inherit" onClick={handleDeletClick} />
          </IconButton>
        </CardActions>
      </CardActionArea>
    </Card>
  );
}
