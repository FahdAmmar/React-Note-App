import * as React from 'react';
import PropTypes from 'prop-types';
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  Toolbar,
  Typography,
  TextField,
  Button,
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
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notes as AllNotesIcon,
  CheckCircle as CheckedIcon,
  RadioButtonUnchecked as NotCheckedIcon,
  Add as AddIcon,
  Search as SearchIcon,
} from '@mui/icons-material';
import { useState, useContext, useEffect, useMemo, useCallback } from 'react';
import MainContext from '../ContextFolder/MainContext';
import { v4 as uuidv4 } from 'uuid';
import CardNote from './CardNote';

const drawerWidth = 240;
const STORAGE_KEY = 'notes_app_data';
const MAX_TITLE_LENGTH = 100;
const MAX_CONTENT_LENGTH = 500;

function ResponsiveDrawer(props) {
  const { notes, setNotes } = useContext(MainContext);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inputValues, setInputValues] = useState({ title: '', content: '' });
  const [isInitialized, setIsInitialized] = useState(false);

  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));

  // تحميل الملاحظات من التخزين المحلي مرة واحدة عند التحميل
  useEffect(() => {
    const loadNotes = () => {
      try {
        const savedNotes = localStorage.getItem(STORAGE_KEY);
        if (savedNotes) {
          const parsedNotes = JSON.parse(savedNotes);
          if (Array.isArray(parsedNotes)) {
            // التحقق من صحة كل عنصر في المصفوفة
            const validNotes = parsedNotes.filter(note =>
              note &&
              note.id &&
              note.title &&
              typeof note.title === 'string' &&
              typeof note.completed === 'boolean'
            );

            if (validNotes.length > 0) {
              setNotes(validNotes);
            } else {
              setNotes([]);
            }
          } else {
            setNotes([]);
          }
        } else {
          setNotes([]);
        }
      } catch (error) {
        console.error('Error loading notes from localStorage:', error);
        // محاولة استرداد البيانات التالفة أو بدء تشغيل جديد
        localStorage.removeItem(STORAGE_KEY);
        setNotes([]);
      } finally {
        setIsInitialized(true);
      }
    };

    loadNotes();
  }, [setNotes]);

  // حفظ الملاحظات في التخزين المحلي عند التغيير
  useEffect(() => {
    if (!isInitialized) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      console.error('Error saving notes to localStorage:', error);
      // محاولة تنظيف الذاكرة المؤقتة إذا كانت ممتلئة
      if (error.name === 'QuotaExceededError') {
        console.warn('LocalStorage quota exceeded. Clearing old data...');
        localStorage.clear();
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(notes.slice(0, 10))); // حفظ أول 10 ملاحظة فقط
        } catch (e) {
          console.error('Failed to save after clearing storage:', e);
        }
      }
    }
  }, [notes, isInitialized]);

  // تصفية الملاحظات مع دمج البحث والفلاتر
  const filteredNotes = useMemo(() => {
    if (!Array.isArray(notes)) return [];

    return notes.filter(note => {
      const matchesSearch =
        note.title?.toLowerCase().includes(search.toLowerCase()) ||
        note.content?.toLowerCase().includes(search.toLowerCase());

      switch (filter) {
        case 'completed':
          return note.completed && matchesSearch;
        case 'notcompleted':
          return !note.completed && matchesSearch;
        default:
          return matchesSearch;
      }
    });
  }, [notes, search, filter]);

  // معالجة فتح/إغلاق القائمة الجانبية
  const handleDrawerToggle = useCallback(() => {
    setMobileOpen(prev => !prev);
  }, []);

  // معالجة إغلاق النافذة المنبثقة
  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    setInputValues({ title: '', content: '' });
  }, []);

  // إضافة ملاحظة جديدة
  const handleAddNote = useCallback((e) => {
    e.preventDefault();

    const title = inputValues.title.trim();
    const content = inputValues.content.trim();

    if (!title || content) return;

    const newNote = {
      id: uuidv4(),
      title: title || 'Untitled Note',
      content: content || '',
      completed: false,
      lastModified: new Date().toLocaleString()
    };

    setNotes(prev => [...prev, newNote]);
    handleDialogClose();
  }, [inputValues, setNotes, handleDialogClose]);

  // تحديث حقول النموذج
  const handleInputChange = useCallback((field) => (e) => {
    const maxLength = field === 'title' ? MAX_TITLE_LENGTH : MAX_CONTENT_LENGTH;
    const value = e.target.value.slice(0, maxLength);
    setInputValues(prev => ({ ...prev, [field]: value }));
  }, []);

  // محتوى القائمة الجانبية
  const drawerContent = useMemo(() => (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: '#313a41',
        color: 'white'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', minHeight: '64px' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Notes
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={() => setDialogOpen(true)}
          aria-label="Add new note"
          sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}
        >
          <AddIcon />
        </IconButton>
      </Toolbar>

      <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />

      <List sx={{ flex: 1, overflow: 'auto' }}>
        {[
          { text: 'All Notes', value: 'all', icon: <AllNotesIcon /> },
          { text: 'Completed', value: 'completed', icon: <CheckedIcon /> },
          { text: 'Pending', value: 'notcompleted', icon: <NotCheckedIcon /> },
        ].map((item) => {
          const count = item.value === 'all'
            ? notes.length
            : item.value === 'completed'
              ? notes.filter(n => n.completed).length
              : notes.filter(n => !n.completed).length;

          return (
            <ListItem key={item.value} disablePadding>
              <ListItemButton
                selected={filter === item.value}
                onClick={() => {
                  setFilter(item.value);
                  if (isSmDown) setMobileOpen(false);
                }}
                sx={{
                  '&.Mui-selected': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' }
                  },
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' }
                }}
              >
                <ListItemIcon sx={{ color: 'inherit', minWidth: '40px' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{ fontWeight: filter === item.value ? 600 : 400 }}
                />
                <Typography variant="body2" sx={{
                  ml: 1,
                  bgcolor: 'rgba(255,255,255,0.1)',
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  minWidth: '24px',
                  textAlign: 'center'
                }}>
                  {count}
                </Typography>
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: 2, fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
        {notes.length} total notes
      </Box>
    </Box>
  ), [filter, notes, isSmDown]);

  const container = typeof window !== 'undefined' ? () => window.document.body : undefined;

  return (
    <Box sx={{ display: 'flex', bgcolor: '#f5f5f5', minHeight: '100vh', width: "100vw" }}>
      <CssBaseline />

      {/* شريط التنقل العلوي */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: '#313a41',
        }}
      >
        <Toolbar sx={{ minHeight: '64px' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flexGrow: 1, maxWidth: 600, ml: { xs: 0, sm: 2 } }}>
            <TextField
              fullWidth
              variant="outlined"
              size="small"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />,
                sx: {
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderRadius: 2,
                  '& fieldset': { border: 'none' },
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' },
                  '&.Mui-focused': { bgcolor: 'rgba(255,255,255,0.2)' }
                }
              }}
              inputProps={{
                'aria-label': 'Search notes',
                maxLength: 50
              }}
            />
          </Box>
        </Toolbar>
      </AppBar>

      {/* القائمة الجانبية */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: '#313a41',
            },
          }}
        >
          {drawerContent}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              bgcolor: '#313a41',
              borderRight: '1px solid rgba(255,255,255,0.1)'
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* منطقة المحتوى الرئيسي */}
      <Box
        component="main"
        sx={{
          backgroundColor: '#292d3e',
          flexGrow: 1,
          p: { xs: 2, sm: 3, md: 4 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          mt: { xs: '64px', sm: 0 }
        }}
      >
        <Toolbar sx={{ display: { sm: 'none' }, minHeight: '64px' }} />

        {/* شبكة الملاحظات */}
        <Box
          sx={{
            width: "100%",
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(auto-fill, minmax(280px, 1fr))',
              lg: 'repeat(auto-fill, minmax(300px, 1fr))'
            },
            gap: 3,
            mt: 2,
            autoRows: 'minmax(200px, auto)'
          }}
        >
          {filteredNotes.map((note) => (
            <CardNote key={note.id} note={note} />
          ))}

          {filteredNotes.length === 0 && (
            <Box sx={{
              gridColumn: '1/-1',
              textAlign: 'center',
              py: 8,
              color: 'rgba(255,255,255,0.6)'
            }}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                {search ? 'No matching notes found' : 'No notes yet'}
              </Typography>
              <Typography variant="body2" sx={{ mb: 3 }}>
                {search
                  ? 'Try adjusting your search terms or filters'
                  : 'Start by clicking the + button to create your first note'}
              </Typography>
              {!search && (
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => setDialogOpen(true)}
                  sx={{
                    bgcolor: '#4a90e2',
                    '&:hover': { bgcolor: '#3a80d2' }
                  }}
                >
                  Create First Note
                </Button>
              )}
            </Box>
          )}
        </Box>
      </Box>

      {/* نافذة إضافة ملاحظة جديدة */}
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
        aria-labelledby="add-note-dialog"
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle id="add-note-dialog" sx={{ fontWeight: 600 }}>
          Add New Note
        </DialogTitle>
        <form onSubmit={handleAddNote}>
          <DialogContent>
            <DialogContentText sx={{ mb: 3 }}>
              Create a new note with title and content
            </DialogContentText>

            <TextField
              autoFocus
              margin="dense"
              label="Note Title"
              fullWidth
              variant="outlined"
              value={inputValues.title}
              onChange={handleInputChange('title')}
              inputProps={{
                maxLength: MAX_TITLE_LENGTH
              }}
              helperText={`${inputValues.title.length}/${MAX_TITLE_LENGTH}`}
              sx={{ mb: 2 }}
            />

            <TextField
              margin="dense"
              label="Note Content"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              value={inputValues.content}
              onChange={handleInputChange('content')}
              inputProps={{
                maxLength: MAX_CONTENT_LENGTH
              }}
              helperText={`${inputValues.content.length}/${MAX_CONTENT_LENGTH}`}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3, pt: 0 }}>
            <Button
              onClick={handleDialogClose}
              variant="outlined"
              sx={{ mr: 1 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!inputValues.title.trim() && !inputValues.content.trim()}
              sx={{
                px: 3,
                bgcolor: '#4a90e2',
                '&:hover': { bgcolor: '#3a80d2' }
              }}
            >
              Add Note
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}

ResponsiveDrawer.propTypes = {
  window: PropTypes.object,
};

export default ResponsiveDrawer;