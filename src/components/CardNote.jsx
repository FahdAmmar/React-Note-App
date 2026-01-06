import React, { useContext } from 'react';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonChecked as RadioButtonCheckedIcon
} from '@mui/icons-material';
import MainContext from '../ContextFolder/MainContext';

export default function CardNote({ note, onEdit }) {
  const { setNotes } = useContext(MainContext);

  const handleDelete = () => {
    setNotes(prev => prev.filter(n => n.id !== note.id));
  };

  const handleToggleComplete = () => {
    setNotes(prev => prev.map(n =>
      n.id === note.id
        ? { ...n, completed: !n.completed, lastModified: new Date().toISOString() }
        : n
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      className={`
        bg-${note.completed ? 'success-500/10' : 'dark-900'} 
        border border-white/10 rounded-xl overflow-hidden relative
        transition-all duration-200
      `}
    >
      <div className="p-4 flex items-start gap-3">
        <button
          onClick={handleToggleComplete}
          className="mt-1"
          aria-label={note.completed ? "Mark as incomplete" : "Mark as complete"}
        >
          {note.completed ? (
            <CheckCircleIcon className="text-success-500" fontSize="small" />
          ) : (
            <RadioButtonCheckedIcon className="text-white/50" fontSize="small" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h3 className={`font-semibold mb-2 break-words ${note.completed
            ? 'line-through text-white/70'
            : 'text-white'
            }`}>
            {note.title}
          </h3>

          <p className={`text-sm whitespace-pre-wrap break-words line-clamp-5 ${note.completed ? 'text-white/60' : 'text-white/80'
            }`}>
            {note.content}
          </p>
        </div>
      </div>

      <div className="px-4 pb-4 flex justify-between items-center border-t border-white/10">
        <span className="text-xs text-white/50">
          {formatDate(note.lastModified || note.time)}
        </span>

        <div className="flex gap-1">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="p-1.5 text-warning-400 hover:bg-warning-500/20 rounded transition-colors"
              title="Edit note"
            >
              <EditIcon fontSize="small" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete();
            }}
            className="p-1.5 text-error-400 hover:bg-error-500/20 rounded transition-colors"
            title="Delete note"
          >
            <DeleteIcon fontSize="small" />
          </button>
        </div>
      </div>
    </div>
  );
}