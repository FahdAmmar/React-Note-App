// =====================================================
// مكوّن شريط التنقل العلوي (TopBar)
// يحتوي على شعار التطبيق وزر تبديل الثيم وزر إضافة ملاحظة
// =====================================================

import React from "react";
import { AppBar, Toolbar, IconButton, Button, Tooltip } from "@mui/material";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "../context/ThemeContext";

interface TopBarProps {
    onAddNote: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onAddNote }) => {
    // جلب حالة الثيم ودالة التبديل من Context
    const { isDark, toggleTheme } = useTheme();

    return (
        <AppBar
            position="static"
            elevation={0}
            className="border-b border-gray-200 dark:border-gray-700"
            sx={{
                background: isDark ? "#111827" : "#ffffff",
                color: isDark ? "#f9fafb" : "#111827",
            }}
        >
            <Toolbar className="flex items-center justify-between px-4 sm:px-6">
                {/* الشعار */}
                <div className="flex items-center gap-2">
                    <NoteAltIcon className="text-indigo-600" />
                    <span className="text-base font-semibold tracking-tight">
                        NoteApp
                    </span>
                </div>

                {/* الإجراءات */}
                <div className="flex items-center gap-2">
                    {/* زر تبديل الثيم */}
                    <Tooltip title={isDark ? "Light mode" : "Dark mode"}>
                        <IconButton onClick={toggleTheme} size="small">
                            {isDark ? (
                                <LightModeIcon fontSize="small" />
                            ) : (
                                <DarkModeIcon fontSize="small" />
                            )}
                        </IconButton>
                    </Tooltip>

                    {/* زر إضافة ملاحظة */}
                    <Button
                        onClick={onAddNote}
                        startIcon={<AddIcon />}
                        size="small"
                        variant="contained"
                        sx={{
                            borderRadius: "8px",
                            textTransform: "none",
                            background: "#4f46e5",
                            "&:hover": { background: "#4338ca" },
                        }}
                    >
                        Add Note
                    </Button>
                </div>
            </Toolbar>
        </AppBar>
    );
};

export default TopBar;