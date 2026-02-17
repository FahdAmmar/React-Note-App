import * as React from 'react';
import PropTypes from 'prop-types';
import {
  AppBar, Box, CssBaseline, Divider, Drawer, IconButton, List, ListItem,
  ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, TextField,
  Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  InputBase, Paper, Grid, Badge
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Notes as NotesIcon,
  CheckCircle as CheckedIcon,
  RadioButtonUnchecked as NotCheckedIcon,
  Edit as EditIcon, // أيقونة التعديل (اختياري)
} from '@mui/icons-material';
import CardNote from './CardNote.jsx';
import { useContext, useEffect, useState, useMemo } from 'react';
import MainContext from '../ContextFolder/MainContext.jsx';
import { v4 as uuidv4 } from 'uuid';
import { useTheme } from '../theme/ThemeContext.jsx';

const drawerWidth = 240;

const NAVIGATION = [
  { id: 'all', text: 'All Notes', icon: <NotesIcon /> },
  { id: 'completed', text: 'Completed', icon: <CheckedIcon /> },
  { id: 'active', text: 'Active', icon: <NotCheckedIcon /> },
];

const NOTE_COLORS = ['#ffcdd2', '#f8bbd0', '#e1bee7', '#d1c4e9', '#c5cae9', '#bbdefb', '#b3e5fc', '#b2ebf2', '#b2dfdb', '#c8e6c9', '#dcedc8', '#f0f4c3', '#fff9c4', '#ffecb3', '#ffe0b2', '#ffccbc'];

function ResponsiveDrawer(props) {
  const { window } = props;
  const { notes, setNotes } = useContext(MainContext);
  const { theme, toggleTheme, isDarkMode } = useTheme();

  // حالة القائمة الجانبية
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  // حالة الفلترة والبحث
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState("");

  // --- حالة نافذة إضافة ملاحظة ---
  const [openDialog, setOpenDialog] = useState(false);
  const [newNote, setNewNote] = useState({ title: "", content: "" });

  // --- حالة نافذة تعديل ملاحظة (جديد) ---
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [currentEditNote, setCurrentEditNote] = useState({ id: '', title: '', content: '' });

  // === حساب الأعداد ===
  const counts = useMemo(() => ({
    all: notes.length,
    active: notes.filter(note => !note.completed).length,
    completed: notes.filter(note => note.completed).length,
  }), [notes]);

  // === الفلترة والبحث ===
  const filteredNotes = useMemo(() => {
    return notes.filter((note) => {
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesFilter =
        filter === 'all' ? true :
          filter === 'completed' ? note.completed :
            filter === 'active' ? !note.completed : true;

      return matchesSearch && matchesFilter;
    });
  }, [notes, searchQuery, filter]);

  // === معالجات الأحداث ===
  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  // --- إضافة ملاحظة جديدة ---
  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.title.trim() && !newNote.content.trim()) return;

    const randomColor = NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];

    const noteToAdd = {
      id: uuidv4(),
      title: newNote.title,
      content: newNote.content,
      completed: false,
      time: new Date().toLocaleString(),
      color: randomColor
    };

    const updatedNotes = [noteToAdd, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));

    setNewNote({ title: "", content: "" });
    setOpenDialog(false);
  };

  // --- دوال التعديل (جديد) ---

  // فتح نافذة التعديل وتعبئة البيانات
  const handleEditDialogOpen = (note) => {
    setCurrentEditNote({
      id: note.id,
      title: note.title,
      content: note.content
    });
    setOpenEditDialog(true);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
    setCurrentEditNote({ id: '', title: '', content: '' });
  };

  // حفظ التعديلات
  const handleUpdateNote = () => {
    const updatedNotes = notes.map(note => {
      if (note.id === currentEditNote.id) {
        return {
          ...note, // الاحتفاظ بالباقي (اللون، الحالة، الوقت)
          title: currentEditNote.title,
          content: currentEditNote.content,
          // يمكن تحديث الوقت هنا أيضاً إذا أردت: time: new Date().toLocaleString()
        };
      }
      return note;
    });

    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
    setOpenEditDialog(false);
  };

  // تحميل البيانات
  useEffect(() => {
    const savedNotes = localStorage.getItem("notes");
    if (savedNotes) {
      try {
        let parsedNotes = JSON.parse(savedNotes);
        const hasOldData = parsedNotes.some(note => note.hasOwnProperty('complated'));

        if (hasOldData) {
          parsedNotes = parsedNotes.map(note => {
            if (note.complated !== undefined) {
              return { ...note, completed: note.complated };
            }
            return note;
          });
          localStorage.setItem("notes", JSON.stringify(parsedNotes));
        }
        setNotes(parsedNotes);
      } catch (error) {
        console.error("Failed to parse notes", error);
      }
    }
  }, []);

  // === تصميم القائمة الجانبية ===
  const drawer = (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2 }}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          Notes App
        </Typography>
        <IconButton
          onClick={() => setOpenDialog(true)}
          color="primary"
          sx={{ bgcolor: 'primary.light', '&:hover': { bgcolor: 'primary.main', color: 'white' } }}
        >
          <AddIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List sx={{ px: 2, py: 2 }}>
        <Typography variant="overline" color="text.secondary" sx={{ px: 2, fontSize: '0.75rem' }}>
          Filters
        </Typography>
        {NAVIGATION.map((item) => (
          <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
            <ListItemButton
              selected={filter === item.id}
              onClick={() => setFilter(item.id)}
              sx={{
                borderRadius: 2,
                bgcolor: filter === item.id ? 'action.selected' : 'transparent',
                '&.Mui-selected': {
                  bgcolor: 'primary.main',
                  color: 'white',
                  '& .MuiSvgIcon-root': { color: 'white' }
                },
                '&:hover': {
                  bgcolor: filter === item.id ? 'primary.dark' : 'action.hover',
                }
              }}
            >
              <ListItemIcon sx={{ minWidth: 0, mr: 2, justifyContent: 'center' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.9rem' }} />
            </ListItemButton>
            <Badge
              badgeContent={counts[item.id]}
              color="primary"
              overlap="circular"
              sx={{ '& .MuiBadge-badge': { fontSize: '0.7rem', minWidth: '20px', height: '20px' } }}
            />
          </ListItem>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="caption" color="text.secondary">
          {notes.length} Notes stored
        </Typography>
      </Box>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      {/* AppBar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          color: 'text.primary',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Paper
            component="form"
            sx={{
              p: '2px 4px',
              display: 'flex',
              alignItems: 'center',
              width: '100%',
              maxWidth: 600,
              mx: 'auto',
              boxShadow: 'none',
              border: '1px solid #e0e0e0',
              borderRadius: 2
            }}
          >
            <IconButton sx={{ p: '10px' }} aria-label="menu">
              <SearchIcon color="action" />
            </IconButton>
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search notes..."
              inputProps={{ 'aria-label': 'search notes' }}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Paper>
          <button onClick={toggleTheme} style={{ border: 'none', background: 'transparent', cursor: 'pointer', marginRight: '10px', fontWeight: 'bold' }}>
            {isDarkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </Toolbar>
      </AppBar>

      {/* Navigation Drawer */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }} aria-label="mailbox folders">
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none', bgcolor: 'background.default' },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: '#f5f7fa'
        }}
      >
        <Toolbar />

        {filteredNotes.length > 0 ? (
          <Grid container spacing={3}>
            {filteredNotes.map((note) => (
              // --- تم تغليف البطاقة بـ Box لإضافة حدث النقر المزدوج ---
              <Grid item xs={12} sm={6} md={4} lg={3} key={note.id}>
                <Box
                  sx={{ height: '100%', cursor: 'pointer' }}
                  onDoubleClick={() => handleEditDialogOpen(note)}
                  title="Double click to edit"
                >
                  <CardNote note={note} />
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60vh',
            color: 'text.secondary',
            textAlign: 'center'
          }}>
            <NotesIcon sx={{ fontSize: 64, mb: 2, opacity: 0.5 }} />
            <Typography variant="h6">No notes found</Typography>
            <Typography variant="body2">Try adjusting your search or filters</Typography>
          </Box>
        )}
      </Box>

      {/* Dialog for New Note */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
          Create New Note
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText sx={{ mb: 2 }}>
            Write down your ideas below. Don't forget to save!
          </DialogContentText>
          <Box component="form" id="add-note-form" onSubmit={handleAddNote}>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              type="text"
              fullWidth
              variant="outlined"
              value={newNote.title}
              onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Content"
              type="text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={newNote.content}
              onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)} color="secondary">Cancel</Button>
          <Button
            type="submit"
            form="add-note-form"
            variant="contained"
            sx={{ px: 4, py: 1, borderRadius: 2 }}
          >
            Save Note
          </Button>
        </DialogActions>
      </Dialog>

      {/* --- Dialog for Edit Note (جديد) --- */}
      <Dialog
        open={openEditDialog}
        onClose={handleEditDialogClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ bgcolor: 'secondary.main', color: 'white' }}>
          Edit Note
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          <DialogContentText sx={{ mb: 2 }}>
            Modify the details of your note below.
          </DialogContentText>
          <Box component="form" id="edit-note-form" onSubmit={(e) => { e.preventDefault(); handleUpdateNote(); }}>
            <TextField
              autoFocus
              margin="dense"
              label="Title"
              type="text"
              fullWidth
              variant="outlined"
              value={currentEditNote.title}
              onChange={(e) => setCurrentEditNote({ ...currentEditNote, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Content"
              type="text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={currentEditNote.content}
              onChange={(e) => setCurrentEditNote({ ...currentEditNote, content: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleEditDialogClose} color="secondary">Cancel</Button>
          <Button
            type="submit"
            form="edit-note-form"
            variant="contained"
            color="secondary"
            sx={{ px: 4, py: 1, borderRadius: 2 }}
          >
            Update Note
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  window: PropTypes.func,
};

export default ResponsiveDrawer;