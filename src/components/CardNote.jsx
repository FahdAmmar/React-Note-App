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
import { useState,useContext } from 'react';
import MainContext from '../ContextFolder/MainContext.jsx'; 






export default function CardNote({note}) {
  const { notes, setNotes } = useContext(MainContext);

 const handleDeletClick=()=>{
    const updatedNotes = notes.filter((n) => n.id !== note.id);
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  }


  const colorNote =["#FFCDD2", "#F8BBD0", "#E1BEE7", "#D1C4E9", "#C5CAE9", "#BBDEFB", "#B3E5FC", "#B2EBF2", "#B2DFDB", "#C8E6C9", "#DCEDC8", "#F0F4C3", "#FFF9C4", "#FFECB3", "#FFE0B2", "#FFCCBC"];


  return (
    <Card sx={{ maxWidth: 200, marginBottom:.5 ,marginTop:.5, boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', borderRadius: '15px',maxHeight:"200px", backgroundColor: colorNote[Math.floor(Math.random() * colorNote.length)]}}>
      <CardActionArea>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {note.title}
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary',overflowY:"auto", maxHeight:"100px" }}>   
            {note.content}
          </Typography>
        </CardContent>
           <CardActions className=' h-10 flex justify-end'>
                <IconButton  aria-label="delete" size="large">
        <DeleteIcon className='text-red-700 hover:text-red-500' fontSize="inherit"  onClick={handleDeletClick}/>
      </IconButton>
      </CardActions>
      </CardActionArea>
    </Card>
  );
}
