import React, { useState, useContext, useEffect, useMemo, useCallback } from 'react';
import {
  Drawer,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notes as AllNotesIcon,
  CheckCircle as CheckedIcon,
  RadioButtonUnchecked as NotCheckedIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import MainContext from '../ContextFolder/MainContext';
import CardNote from './CardNote';

const STORAGE_KEY = 'notes_app_data';
const MAX_TITLE_LENGTH = 100;
const MAX_CONTENT_LENGTH = 500;

export default function ResponsiveDrawer() {
  const { notes, setNotes } = useContext(MainContext);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('add');
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [inputValues, setInputValues] = useState({ title: '', content: '' });
  const [isInitialized, setIsInitialized] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));

  // Initialize notes from localStorage
  useEffect(() => {
    const loadNotes = () => {
      try {
        const savedNotes = localStorage.getItem(STORAGE_KEY);
        if (savedNotes) {
          const parsedNotes = JSON.parse(savedNotes);
          if (Array.isArray(parsedNotes)) {
            const validNotes = parsedNotes.filter(note =>
              note && note.id && note.title && typeof note.completed === 'boolean');
            setNotes(validNotes.length > 0 ? validNotes : []);
          }
        }
      } catch (error) {
        console.error('Error loading notes:', error);
        localStorage.removeItem(STORAGE_KEY);
      } finally {
        setIsInitialized(true);
      }
    };
    loadNotes();
  }, []);

  // Save notes to localStorage
  useEffect(() => {
    if (!isInitialized) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        console.warn('Storage quota exceeded. Clearing old data...');
        localStorage.clear();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes.slice(0, 10)));
      }
    }
  }, [notes, isInitialized]);

  const filteredNotes = useMemo(() => {
    if (!Array.isArray(notes)) return [];

    return notes.filter(note => {
      const matchesSearch = note.title?.toLowerCase().includes(search.toLowerCase()) ||
        note.content?.toLowerCase().includes(search.toLowerCase());

      switch (filter) {
        case 'completed': return note.completed && matchesSearch;
        case 'notcompleted': return !note.completed && matchesSearch;
        default: return matchesSearch;
      }
    });
  }, [notes, search, filter]);

  const handleDrawerToggle = useCallback(() => setMobileOpen(prev => !prev), []);
  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    setInputValues({ title: '', content: '' });
    setEditingNoteId(null);
    setIsSaving(false);
  }, []);

  const handleOpenAddDialog = useCallback(() => {
    setDialogMode('add');
    setInputValues({ title: '', content: '' });
    setDialogOpen(true);
  }, []);

  const handleOpenEditDialog = useCallback((noteId) => {
    const note = notes.find(n => n.id === noteId);
    if (!note) return;

    setDialogMode('edit');
    setEditingNoteId(noteId);
    setInputValues({ title: note.title || '', content: note.content || '' });
    setDialogOpen(true);
  }, [notes]);

  const handleSaveNote = useCallback((e) => {
    e.preventDefault();
    const { title, content } = inputValues;
    if (!title.trim() && !content.trim()) {
      showSnackbar('Note cannot be empty', 'error');
      return;
    }

    setIsSaving(true);
    setTimeout(() => {
      if (dialogMode === 'add') {
        const newNote = {
          id: uuidv4(),
          title: title.trim() || 'Untitled Note',
          content: content.trim() || '',
          completed: false,
          time: new Date().toISOString(),
          lastModified: new Date().toISOString()
        };
        setNotes(prev => [...prev, newNote]);
        showSnackbar('Note added successfully!', 'success');
      } else if (editingNoteId) {
        setNotes(prev => prev.map(note =>
          note.id === editingNoteId
            ? { ...note, title: title.trim() || 'Untitled Note', content: content.trim() || '', lastModified: new Date().toISOString() }
            : note
        ));
        showSnackbar('Note updated successfully!', 'success');
      }
      handleDialogClose();
      setIsSaving(false);
    }, 300);
  }, [dialogMode, editingNoteId, inputValues, setNotes]);

  const handleInputChange = useCallback((field) => (e) => {
    const maxLength = field === 'title' ? MAX_TITLE_LENGTH : MAX_CONTENT_LENGTH;
    setInputValues(prev => ({ ...prev, [field]: e.target.value.slice(0, maxLength) }));
  }, []);

  const showSnackbar = useCallback((message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const drawerContent = (
    <div className="flex flex-col h-full w-full bg-dark-800 text-white">
      <div className="flex justify-between items-center p-4 min-h-[64px]">
        <h1 className="text-xl font-semibold">Notes</h1>
        <button
          onClick={handleOpenAddDialog}
          className="p-2 rounded hover:bg-white/10 transition-colors"
          aria-label="Add new note"
        >
          <AddIcon className="text-white" />
        </button>
      </div>
      <div className="my-2 border-t border-white/10" />

      <div className="flex-1 overflow-y-auto">
        <List>
          {[
            { text: 'All Notes', value: 'all', icon: <AllNotesIcon /> },
            { text: 'Completed', value: 'completed', icon: <CheckedIcon /> },
            { text: 'Pending', value: 'notcompleted', icon: <NotCheckedIcon /> },
          ].map((item) => {
            const count = item.value === 'all'
              ? notes.length
              : notes.filter(n => item.value === 'completed' ? n.completed : !n.completed).length;

            return (
              <ListItem key={item.value} disablePadding>
                <ListItemButton
                  selected={filter === item.value}
                  onClick={() => {
                    setFilter(item.value);
                    if (isSmDown) setMobileOpen(false);
                  }}
                  className={`${filter === item.value
                    ? 'bg-white/10 hover:bg-white/15'
                    : 'hover:bg-white/5'
                    }`}
                >
                  <ListItemIcon className="text-inherit min-w-[40px]">
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      className: filter === item.value ? 'font-semibold' : 'font-normal'
                    }}
                  />
                  <span className="ml-2 bg-white/10 px-2 py-1 rounded text-xs min-w-[24px] text-right">
                    {count}
                  </span>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </div>

      <div className="p-4 text-xs text-white/60 border-t border-white/10">
        {notes.length} total notes
      </div>
    </div>
  );

  const container = typeof window !== 'undefined' ? () => window.document.body : undefined;

  return (
    <div className="flex min-h-screen bg-gray-50 min-w-screen">
      {/* Top App Bar */}
      <header className="fixed top-0 left-0 right-0 z-10 sm:w-[calc(100%-200px)] sm:ml-52 bg-dark-800">
        <div className="flex items-center h-16 px-4">
          <button
            onClick={handleDrawerToggle}
            className="mr-4 text-white sm:hidden"
            aria-label="Toggle drawer"
          >
            <MenuIcon />
          </button>

          <div className="flex-1 max-w-xl ml-2 sm:ml-0">
            <div className="relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value.slice(0, 50))}
                placeholder="Search notes..."
                className="w-full py-2 pl-10 pr-4 bg-white/10 rounded-lg focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors"
                aria-label="Search notes"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <aside className="fixed sm:relative z-20">
        <Drawer
          container={container}
          variant={isSmDown ? "temporary" : "permanent"}
          open={isSmDown ? mobileOpen : true}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
        >
          {drawerContent}
        </Drawer>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pt-16 sm:pt-0 p-4 sm:p-6 sm:mt-8 md:p-8  sm:ml-40   w-full">


        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(200px,auto)]">
          {filteredNotes.map(note => (
            <div
              key={note.id}
              onDoubleClick={() => handleOpenEditDialog(note.id)}
              className="cursor-pointer transition-transform hover:scale-[1.02] hover:shadow-lg"
            >
              <CardNote
                note={note}
                onEdit={() => handleOpenEditDialog(note.id)}
              />
            </div>
          ))}

          {filteredNotes.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              <h2 className="text-xl font-medium mb-2">
                {search ? 'No matching notes found' : 'No notes yet'}
              </h2>
              <p className="mb-4">
                {search
                  ? 'Try adjusting your search terms or filters'
                  : 'Start by clicking the + button to create your first note'}
              </p>
              {!search && (
                <button
                  onClick={handleOpenAddDialog}
                  className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center mx-auto"
                >
                  <AddIcon className="mr-2" /> Create First Note
                </button>
              )}
            </div>
          )}
        </div>

        {filteredNotes.length > 0 && (
          <p className="text-center mt-6 text-gray-400 italic">
            💡 Double-click on any note to edit it
          </p>
        )}
      </main>

      {/* Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
        aria-labelledby="note-dialog"
      >
        <DialogTitle id="note-dialog" className="font-semibold">
          {dialogMode === 'add' ? 'Add New Note' : 'Edit Note'}
        </DialogTitle>
        <form onSubmit={handleSaveNote}>
          <DialogContent>
            <DialogContentText className="mb-4">
              {dialogMode === 'add'
                ? 'Create a new note with title and content'
                : 'Edit your note title and content'}
            </DialogContentText>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Note Title</label>
              <input
                autoFocus
                value={inputValues.title}
                onChange={handleInputChange('title')}
                maxLength={MAX_TITLE_LENGTH}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                {inputValues.title.length}/{MAX_TITLE_LENGTH}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Note Content</label>
              <textarea
                value={inputValues.content}
                onChange={handleInputChange('content')}
                maxLength={MAX_CONTENT_LENGTH}
                rows="4"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1 text-right">
                {inputValues.content.length}/{MAX_CONTENT_LENGTH}
              </p>
            </div>
          </DialogContent>

          <DialogActions className="p-4 pt-0">
            <button
              type="button"
              onClick={handleDialogClose}
              disabled={isSaving}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving || (!inputValues.title.trim() && !inputValues.content.trim())}
              className={`
                px-4 py-2 rounded-lg font-medium flex items-center justify-center
                ${dialogMode === 'add'
                  ? 'bg-primary-500 hover:bg-primary-600'
                  : 'bg-warning-500 hover:bg-warning-600'
                } text-white disabled:opacity-70
              `}
            >
              {isSaving ? (
                <>
                  <CircularProgress size={20} className="mr-2 text-white" />
                  {dialogMode === 'add' ? 'Adding...' : 'Saving...'}
                </>
              ) : (
                dialogMode === 'add' ? 'Add Note' : 'Save Changes'
              )}
            </button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
          className="w-full"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}