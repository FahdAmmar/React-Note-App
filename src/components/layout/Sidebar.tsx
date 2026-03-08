// src/components/layout/Sidebar.tsx
import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Box, Badge, Divider, Button, IconButton } from '@mui/material';
import { Notes as NotesIcon, CheckCircle as CheckedIcon, RadioButtonUnchecked as NotCheckedIcon, Add as AddIcon } from '@mui/icons-material';
import { useNotes } from '../../context/NotesContext'

const drawerWidth = 240;

// عناصر القائمة
const NAV_ITEMS = [
    { id: 'all', label: 'All Notes', icon: <NotesIcon /> },
    { id: 'completed', label: 'Completed', icon: <CheckedIcon /> },
    { id: 'active', label: 'Active', icon: <NotCheckedIcon /> },
];

interface SidebarProps {
    mobileOpen: boolean;
    onDrawerToggle: () => void;
    filter: string;
    onFilterChange: (filter: string) => void;
    onAddNote: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onDrawerToggle, filter, onFilterChange, onAddNote }) => {
    const { state } = useNotes();
    const { notes } = state;

    // حساب عدد الملاحظات لكل فلتر
    const counts = {
        all: notes.length,
        active: notes.filter(n => !n.completed).length,
        completed: notes.filter(n => n.completed).length,
    };

    // محتوى القائمة
    const drawerContent = (
        <div>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', px: 2 }}>
                <Typography variant="h6" color="primary" fontWeight="bold">Notes App</Typography>
                {/* زر الإضافة في القائمة الجانبية */}
                <IconButton onClick={onAddNote} color="primary" sx={{ bgcolor: 'primary.light', '&:hover': { bgcolor: 'primary.main', color: 'white' } }}>
                    <AddIcon />
                </IconButton>
            </Toolbar>
            <Divider />
            <List sx={{ px: 2, py: 2 }}>
                <Typography variant="overline" color="text.secondary" sx={{ px: 2, fontSize: '0.75rem' }}>Filters</Typography>
                {NAV_ITEMS.map((item) => (
                    <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            selected={filter === item.id}
                            onClick={() => onFilterChange(item.id)}
                            sx={{
                                borderRadius: 2,
                                bgcolor: filter === item.id ? 'action.selected' : 'transparent',
                                '&.Mui-selected': { bgcolor: 'primary.main', color: 'white', '& .MuiSvgIcon-root': { color: 'white' } },
                                '&:hover': { bgcolor: filter === item.id ? 'primary.dark' : 'action.hover' }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: 0, mr: 2, justifyContent: 'center' }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.9rem' }} />
                        </ListItemButton>
                        <Badge badgeContent={counts[item.id as keyof typeof counts]} color="primary" sx={{ ml: 1 }} />
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

    return (
        <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
            {/* نسخة الموبايل */}
            <Drawer
                variant="temporary"
                open={mobileOpen}
                onClose={onDrawerToggle}
                ModalProps={{ keepMounted: true }}
                sx={{
                    display: { xs: 'block', sm: 'none' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                }}
            >
                {drawerContent}
            </Drawer>
            {/* نسخة الديسكتوب */}
            <Drawer
                variant="permanent"
                sx={{
                    display: { xs: 'none', sm: 'block' },
                    '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth, borderRight: 'none', bgcolor: 'background.default' },
                }}
                open
            >
                {drawerContent}
            </Drawer>
        </Box>
    );
};

export default Sidebar;