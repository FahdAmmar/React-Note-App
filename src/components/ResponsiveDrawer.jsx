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

function ResponsiveDrawer(props) {
  const { notes, setNotes } = useContext(MainContext);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inputValues, setInputValues] = useState({ title: '', content: '' });

  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));

  // تحميل الملاحظات من التخزين المحلي مع معالجة الأخطاء
  useEffect(() => {
    const loadNotes = () => {
      try {
        const savedNotes = localStorage.getItem('notes');
        if (savedNotes) {
          const parsedNotes = JSON.parse(savedNotes);
          if (Array.isArray(parsedNotes)) {
            setNotes(parsedNotes);
            return;
          }
        }
        // setNotes([]); // تعيين إلى مصفوفة فارغة إذا لم تكن هناك ملاحظات محفوظة  
      } catch (error) {
        console.error('Error loading notes from localStorage:', error);
        localStorage.removeItem('notes'); // تنظيف البيانات التالفة
        setNotes([]); // تعيين إلى مصفوفة فارغة في حالة الخطأ 
      }
    };
    loadNotes();
  }, [setNotes]);

  // حفظ الملاحظات في التخزين المحلي عند التغيير
  useEffect(() => {
    if (notes.length > 0) {
      try {
        localStorage.setItem('notes', JSON.stringify(notes));
      } catch (error) {
        console.error('Error saving notes to localStorage:', error);
      }
    }
  }, [notes]);

  // تصفية الملاحظات مع دمج البحث والفلاتر
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(search.toLowerCase()) ||
        note.content.toLowerCase().includes(search.toLowerCase());

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
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // معالجة إغلاق النافذة المنبثقة
  const handleDialogClose = useCallback(() => {
    setDialogOpen(false);
    setInputValues({ title: '', content: '' }); // إعادة تعيين الحقول
  }, []);

  // إضافة ملاحظة جديدة
  const handleAddNote = useCallback((e) => {
    e.preventDefault();
    if (!inputValues.title.trim() && !inputValues.content.trim()) return

    const newNote = {
      id: uuidv4(),
      title: inputValues.title.trim(),
      content: inputValues.content.trim(),
      completed: false,
      time: new Date().toISOString() // تخزين كـ ISO string للتواريخ
    };
    setNotes(prev => [...prev, newNote]);
    handleDialogClose();
  }, [inputValues, setNotes, handleDialogClose]);

  // تحديث حقول النموذج
  const handleInputChange = useCallback((field) => (e) => {
    setInputValues(prev => ({ ...prev, [field]: e.target.value }));
  }, []);

  // محتوى القائمة الجانبية
  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        bgcolor: '#313a41',
        color: 'white'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" component="div">
          Notes
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          onClick={() => setDialogOpen(true)}
          aria-label="Add new note"
        >
          <AddIcon />
        </IconButton>
      </Toolbar>

      <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />

      <List sx={{ flex: 1 }}>
        {[
          { text: 'All Notes', value: 'all', icon: <AllNotesIcon /> },
          { text: 'Completed', value: 'completed', icon: <CheckedIcon /> },
          { text: 'Pending', value: 'notcompleted', icon: <NotCheckedIcon /> },
        ].map((item) => (
          <ListItem key={item.value} disablePadding>
            <ListItemButton
              selected={filter === item.value}
              onClick={() => setFilter(item.value)}
              sx={{
                '&.Mui-selected': {
                  bgcolor: 'rgba(255,255,255,0.1)',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.15)' }
                }
              }}
            >
              <ListItemIcon sx={{ color: 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

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

          <Box sx={{ flexGrow: 1, maxWidth: 600 }}>
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
                  '& fieldset': { border: 'none' }
                }
              }}
              inputProps={{ 'aria-label': 'Search notes' }}
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
          variant={isSmDown ? "temporary" : "permanent"}
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
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
          p: 4,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 8, sm: 0 }
        }}
      >
        <Toolbar />

        {/* شبكة الملاحظات */}
        <Box
          sx={{
            width: "100%",
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(3, 1fr)',
              md: 'repeat(4, 1fr)'
            },
            gap: 3,
            mt: 2
          }}
        >
          {filteredNotes.map((note) => (
            <CardNote key={note.id} note={note} />
          ))}

          {filteredNotes.length === 0 && (
            <Box sx={{
              gridColumn: '1/-1',
              textAlign: 'center',
              py: 4,
              color: 'text.secondary'
            }}>
              No notes found. Try changing filters or search terms.
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
      >
        <DialogTitle id="add-note-dialog">Add New Note</DialogTitle>
        <form onSubmit={handleAddNote}>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
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
              required
              inputProps={{ maxLength: 100 }}
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
              required
              inputProps={{ maxLength: 500 }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleDialogClose} variant="outlined">
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!inputValues.title.trim() || !inputValues.content.trim()}
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
  window: PropTypes.func,
};

export default ResponsiveDrawer;