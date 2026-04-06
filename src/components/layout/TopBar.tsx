// src/components/layout/TopBar.tsx
import React from 'react';
import { AppBar, Toolbar, IconButton, InputBase, Paper, Box, Button } from '@mui/material';
import { Menu as MenuIcon, Search as SearchIcon, Add as AddIcon } from '@mui/icons-material';
import { useTheme } from '../../context/ThemeContext';

const drawerWidth = 240;

interface TopBarProps {
    onDrawerToggle: () => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    onAddNote: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onDrawerToggle, searchQuery, onSearchChange, onAddNote }) => {
    const { theme, toggleTheme, isDarkMode } = useTheme();
    console.log(theme)

    return (
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
                    edge="start"
                    onClick={onDrawerToggle}
                    sx={{ mr: 2, display: { sm: 'none' } }}
                >
                    <MenuIcon />
                </IconButton>

                {/* شريط البحث */}
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
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                    />
                </Paper>

                <Box sx={{ ml: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    {/* زر الإضافة في الشريط العلوي (يظهر فقط في الشاشات المتوسطة والكبيرة) */}
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={onAddNote}
                        sx={{ display: { xs: 'none', md: 'flex' } }}
                    >
                        New
                    </Button>
                    {/* زر تبديل الثيم */}
                    <IconButton onClick={toggleTheme} sx={{ ml: 1 }}>
                        {isDarkMode ? '🌙' : '☀️'}
                    </IconButton>

                    <button onClick={toggleTheme}>
                        تغيير إلى الوضع {isDarkMode ? 'الفاتح' : 'الداكن'}
                    </button>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;