// src/components/notes/NotesList.tsx
import React from 'react';
import { Grid, Box, Typography } from '@mui/material';
import { Notes as NotesIcon } from '@mui/icons-material';
import { Note } from '../../types';
import NoteCard from './CardNote';

interface NotesListProps {
    notes: Note[]; // الملاحظات (بعد الفلترة)
    onEditNote: (note: Note) => void; // دالة التعديل
}

const NotesList: React.FC<NotesListProps> = ({ notes, onEditNote }) => {
    // في حال عدم وجود ملاحظات
    if (notes.length === 0) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'text.secondary', textAlign: 'center' }}>
                <NotesIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
                <Typography variant="h6">No notes found</Typography>
                <Typography variant="body2">Try adjusting your search or filters, or add a new note.</Typography>
            </Box>
        );
    }

    // عرض الملاحظات في شبكة (Grid)
    return (
        <Grid container spacing={3}>
            {notes.map((note) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={note.id}>
                    <NoteCard note={note} onEdit={onEditNote} />
                </Grid>
            ))}
        </Grid>
    );
};

export default NotesList;