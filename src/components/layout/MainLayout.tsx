// src/components/layout/MainLayout.tsx
import React, { useState, useMemo } from 'react';
import { Box, Toolbar, CssBaseline, IconButton } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import NotesList from '../notes/NotesList';
import NoteDialog from '../notes/NoteDialog';
import { useNotes } from '../../context/NotesContext';
import { Note } from '../../types';

// مكون زر عائم للإضافة (للموبايل)
const FloatingAddButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <IconButton
        onClick={onClick}
        sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            bgcolor: 'primary.main',
            color: 'white',
            width: 56,
            height: 56,
            boxShadow: 4,
            display: { sm: 'none' },
            zIndex: 1000,
            '&:hover': { bgcolor: 'primary.dark' }
        }}
    >
        <AddIcon />
    </IconButton>
);

const MainLayout: React.FC = () => {
    const { state } = useNotes();
    const { notes } = state;

    // حالات واجهة المستخدم
    const [mobileOpen, setMobileOpen] = useState(false);
    const [filter, setFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [editingNote, setEditingNote] = useState<Note | null>(null);

    // منطق الفلترة والبحث باستخدام useMemo للأداء
    const filteredNotes = useMemo(() => {
        return notes.filter((note) => {
            // فلترة البحث (النص)
            const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                note.content.toLowerCase().includes(searchQuery.toLowerCase());

            // فلترة الحالة (الكل، المكتملة، النشطة)
            const matchesFilter =
                filter === 'all' ? true :
                    filter === 'completed' ? note.completed :
                        filter === 'active' ? !note.completed : true;

            return matchesSearch && matchesFilter;
        });
    }, [notes, searchQuery, filter]);

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

    const handleAddNoteClick = () => {
        setEditingNote(null);
        setOpenDialog(true);
    };

    const handleEditNoteClick = (note: Note) => {
        setEditingNote(note);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingNote(null);
    };

    return (
        <Box sx={{ display: 'flex', bgcolor: '#f5f7fa', minHeight: '100vh' }}>
            <CssBaseline />

            <Sidebar
                mobileOpen={mobileOpen}
                onDrawerToggle={handleDrawerToggle}
                filter={filter}
                onFilterChange={setFilter}
                onAddNote={handleAddNoteClick}
            />

            <Box sx={{ flexGrow: 1, width: { sm: `calc(100% - 240px)` } }}>
                <TopBar
                    onDrawerToggle={handleDrawerToggle}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    onAddNote={handleAddNoteClick}
                />

                <Box component="main" sx={{ p: 3 }}>
                    <Toolbar />
                    <NotesList notes={filteredNotes} onEditNote={handleEditNoteClick} />
                </Box>
            </Box>

            <FloatingAddButton onClick={handleAddNoteClick} />

            <NoteDialog
                open={openDialog}
                onClose={handleCloseDialog}
                noteToEdit={editingNote}
            />
        </Box>
    );
};

export default MainLayout;