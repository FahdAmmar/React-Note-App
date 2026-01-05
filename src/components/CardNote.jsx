import * as React from 'react';
import {
  Card,
  CardContent,
  Typography,
  CardActions,
  IconButton,
  Checkbox,
  Tooltip,
  Box,
  useTheme
} from '@mui/material';
import {
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonIcon,
} from '@mui/icons-material';
import { useState, useContext, useCallback } from 'react';
import MainContext from '../ContextFolder/MainContext';

export default function CardNote({ note }) {
  const { notes, setNotes } = useContext(MainContext);
  const [isHovered, setIsHovered] = useState(false);
  const theme = useTheme();

  // تبديل حالة الإكمال
  const handleToggleComplete = useCallback(() => {
    setNotes(prevNotes => prevNotes.map(n => n.id === note.id ? { ...n, completed: !n.completed } : n));
  }, [note.id, setNotes]);

  function handlechecked(id) {
    const updatedNotes = notes.map((note) => {
      if (note.id === id) {
        return { ...note, completed: !note.completed };
      }
      return note;
    });
    setNotes(updatedNotes);
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  }

  // حذف الملاحظة
  const handleDelete = useCallback(() => {
    setNotes(prevNotes => prevNotes.filter(n => n.id !== note.id));
  }, [note.id, setNotes]);

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4]
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label={`Note titled ${note.title}`}
    >
      <CardContent sx={{
        flexGrow: 1,
        pb: 1,
        '&:last-child': { pb: 1 }
      }}>
        <Typography
          variant="h6"
          component="h2"
          sx={{
            fontWeight: 600,
            mb: 1,
            textDecoration: note.completed ? 'line-through' : 'none',
            color: note.completed ? 'text.disabled' : 'text.primary'
          }}
        >
          {note.title}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            color: note.completed ? 'text.disabled' : 'text.secondary',
            whiteSpace: 'pre-wrap',
            lineHeight: 1.6
          }}
        >
          {note.content}
        </Typography>
      </CardContent>

      <CardActions sx={{
        p: 2,
        justifyContent: 'space-between',
        borderTop: '1px solid',
        borderTopColor: 'divider'
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          color: 'text.secondary',
          fontSize: '0.85rem'
        }}>
          <Typography component="time" dateTime={note.time}>
            {formatDate(note.time)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={note.completed ? "Mark as incomplete" : "Mark as complete"}>
            <IconButton
              onClick={() => { handlechecked(note.id); }}
              aria-label={note.completed ? "Mark incomplete" : "Mark complete"}
              size="small"
            >
              {note.completed ? (
                <CheckCircleIcon sx={{ color: 'success.main' }} />
              ) : (
                <RadioButtonIcon sx={{ color: 'action.active' }} />
              )}
            </IconButton>
          </Tooltip>

          <Tooltip title="Delete note">
            <IconButton
              onClick={handleDelete}
              aria-label="Delete note"
              size="small"
              sx={{
                color: isHovered ? 'error.main' : 'action.active',
                transition: 'color 0.2s'
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </Card>
  );
}