import * as React from 'react';
import { useContext } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
  Checkbox,
  Box,
  Tooltip,
  Paper
} from '@mui/material';
import {
  Delete as DeleteIcon,
  CheckCircle as CheckIcon,
  RadioButtonUnchecked as UncheckIcon
} from '@mui/icons-material';
import MainContext from '../ContextFolder/MainContext.jsx';

export default function CardNote({ note }) {
  const { notes, setNotes } = useContext(MainContext);

  const handleToggleComplete = (e) => {
    e.stopPropagation();
    const updatedNotes = notes.map((n) =>
      n.id === note.id ? { ...n, complated: !n.complated } : n
    );
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    const updatedNotes = notes.filter((n) => n.id !== note.id);
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
  };

  return (
    <Paper
      elevation={3}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: note.color || 'background.paper', // استخدام لون الملاحظة أو اللون الافتراضي
        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
        borderRadius: 3, // زوايا ناعمة
        overflow: 'hidden',
        position: 'relative',
        '&:hover': {
          transform: 'translateY(-5px)', // تأثير رفع البطاقة عند التمرير
          boxShadow: 8,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, padding: 2, paddingBottom: 1 }}>
        {/* عنوان الملاحظة */}
        <Typography
          variant="h6"
          component="div"
          gutterBottom
          sx={{
            fontWeight: 'bold',
            textDecoration: note.complated ? 'line-through' : 'none',
            color: note.complated ? 'text.disabled' : 'text.primary',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {note.title || 'Untitled Note'}
        </Typography>

        {/* محتوى الملاحظة */}
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            textDecoration: note.complated ? 'line-through' : 'none',
            overflowY: 'auto',
            maxHeight: '150px', // حد أقصى للارتفاع مع إمكانية التمرير
            whiteSpace: 'pre-wrap', // الحفاظ على الأسطر الجديدة
            fontSize: '0.95rem',
            lineHeight: 1.5,
            '&::-webkit-scrollbar': {
              width: '4px',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '4px',
            },
          }}
        >
          {note.content}
        </Typography>
      </CardContent>

      <CardActions
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingX: 1.5,
          paddingBottom: 1.5,
          borderTop: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        {/* التاريخ والوقت */}
        <Typography
          variant="caption"
          sx={{
            fontSize: '0.75rem',
            color: 'text.secondary',
            opacity: 0.8,
            display: { xs: 'none', sm: 'block' } // إخفاء في الشاشات الصغيرة جداً لتوفير المساحة
          }}
        >
          {note.time}
        </Typography>

        {/* أزرار التحكم */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Tooltip title={note.complated ? "Mark as Active" : "Mark as Completed"}>
            <Checkbox
              icon={<UncheckIcon />}
              checkedIcon={<CheckIcon />}
              checked={note.complated}
              onChange={handleToggleComplete}
              sx={{
                color: note.complated ? 'success.main' : 'text.secondary',
                '&.Mui-checked': {
                  color: 'success.main',
                },
                padding: '4px',
              }}
            />
          </Tooltip>

          <Tooltip title="Delete Note">
            <IconButton
              aria-label="delete"
              size="small"
              onClick={handleDelete}
              sx={{
                color: 'lightred',
                '&:hover': {
                  backgroundColor: 'white',
                  color: 'error.light',
                },
                transition: 'all 0.2s',
                marginLeft: 1,
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      </CardActions>
    </Paper>
  );
}