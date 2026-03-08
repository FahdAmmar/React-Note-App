// src/components/notes/NoteCard.tsx
import React from 'react';
import { Card, CardContent, CardActions, Typography, IconButton, Box, Tooltip, Checkbox, Paper } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, CheckCircle as CheckIcon, RadioButtonUnchecked as UncheckIcon } from '@mui/icons-material';
import { Note } from '../../types';
import { useNotes } from '../../context/NotesContext';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void; // دالة يتم استدعاؤها عند الضغط على زر التعديل
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onEdit }) => {
  const { dispatch } = useNotes();

  // دالة حذف الملاحظة
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      dispatch({ type: 'DELETE_NOTE', payload: note.id });
    }
  };

  // دالة تغيير الحالة (مكتملة / غير مكتملة)
  const handleToggle = () => {
    dispatch({ type: 'TOGGLE_NOTE', payload: note.id });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: note.color || '#fff',
        transition: 'transform 0.2s, box-shadow 0.2s',
        borderRadius: 3,
        overflow: 'hidden',
        border: '1px solid rgba(0,0,0,0.05)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 'bold',
            textDecoration: note.completed ? 'line-through' : 'none',
            color: note.completed ? 'text.disabled' : 'text.primary',
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {note.title || 'Untitled'}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            textDecoration: note.completed ? 'line-through' : 'none',
            whiteSpace: 'pre-wrap',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 5,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {note.content}
        </Typography>
      </CardContent>

      <CardActions sx={{ justifyContent: 'space-between', pl: 2, pr: 1, pb: 1, pt: 0 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
          {note.date}
        </Typography>

        <Box sx={{ display: 'flex', gap: 0.5 }}>
          <Tooltip title={note.completed ? "Mark Active" : "Mark Completed"}>
            <Checkbox
              icon={<UncheckIcon fontSize="small" />}
              checkedIcon={<CheckIcon fontSize="small" />}
              checked={note.completed}
              onChange={handleToggle}
              size="small"
              sx={{ padding: 4, color: note.completed ? 'success.main' : 'text.secondary' }}
            />
          </Tooltip>

          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => onEdit(note)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete">
            <IconButton size="small" onClick={handleDelete} color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </Paper>
  );
};

export default NoteCard;