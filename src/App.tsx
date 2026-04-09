// =====================================================
// المكوّن الجذر للتطبيق (Root Component)
// يجمع كل المكونات ويدير الحالة العليا للتطبيق
// =====================================================

import React, { useState } from "react";
import { ThemeProvider as MUIThemeProvider, createTheme } from "@mui/material";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import TopBar from "./components/TopBar";
import NoteColumn from "./components/NoteColumn";
import AddNoteModal from "./components/AddNoteModal";
import { useNotes } from "./hooks/useNotes";
import { type Note, type ColumnType } from "./types/note";

// تعريف أعمدة اللوحة مع ألوانها
const COLUMNS: { id: ColumnType; label: string; color: string }[] = [
  { id: "start", label: "Start", color: "#94a3b8" },
  { id: "inprogress", label: "In Progress", color: "#f59e0b" },
  { id: "completed", label: "Completed", color: "#10b981" },
];

// المكوّن الداخلي الذي يستخدم ThemeContext
const AppContent: React.FC = () => {
  const { isDark } = useTheme();
  const { addNote, updateNote, deleteNote, moveNote, getNotesByColumn } =
    useNotes();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // إنشاء ثيم MUI ديناميكي بناءً على وضع الثيم
  const muiTheme = createTheme({ palette: { mode: isDark ? "dark" : "light" } });

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setModalOpen(true);
  };

  const handleAddNew = () => {
    setEditingNote(null);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditingNote(null);
  };

  return (
    <MUIThemeProvider theme={muiTheme}>
      <div className={`min-h-screen ${isDark ? "dark bg-gray-900" : "bg-gray-100"}`}>
        <TopBar onAddNote={handleAddNew} />

        {/* لوحة الملاحظات - شبكة ثلاثة أعمدة متجاوبة */}
        <main className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 sm:p-6 max-w-7xl mx-auto">
          {COLUMNS.map((col) => (
            <NoteColumn
              key={col.id}
              id={col.id}
              label={col.label}
              dotColor={col.color}
              notes={getNotesByColumn(col.id)}
              onEdit={handleEdit}
              onDelete={deleteNote}
              onDrop={moveNote} // دالة النقل بالسحب والإفلات
            />
          ))}
        </main>

        {/* نافذة الإضافة / التعديل */}
        <AddNoteModal
          open={modalOpen}
          editingNote={editingNote}
          onClose={handleClose}
          onSave={addNote}
          onUpdate={updateNote}
        />
      </div>
    </MUIThemeProvider>
  );
};

// تغليف AppContent بـ ThemeProvider الخاص بنا
const App: React.FC = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

export default App;