// src/components/notes/NoteDialog.tsx
import React, { useState, useEffect } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button,
    Typography, DialogContentText
} from '@mui/material';
import { Note } from '../../types';
import { useNotes } from '../../context/NotesContext';

// قائمة ألوان عشوائية للملاحظات
const NOTE_COLORS = ['#ffcdd2', '#f8bbd0', '#e1bee7', '#d1c4e9', '#c5cae9', '#bbdefb', '#b3e5fc', '#b2ebf2', '#b2dfdb', '#c8e6c9', '#dcedc8', '#f0f4c3', '#fff9c4', '#ffecb3', '#ffe0b2', '#ffccbc'];

interface NoteDialogProps {
    open: boolean;
    onClose: () => void;
    noteToEdit: Note | null; // إذا تم تمرير ملاحظة هنا، فالنافذة ستكون وضع "تعديل"
}

const NoteDialog: React.FC<NoteDialogProps> = ({ open, onClose, noteToEdit }) => {
    const { dispatch } = useNotes();

    // حالة البيانات داخل النموذج (العنوان والمحتوى)
    const [formData, setFormData] = useState({ title: '', content: '' });

    // عند فتح النافذة: نحدد هل هي وضع إضافة أم تعديل ونملأ البيانات
    useEffect(() => {
        if (open) {
            if (noteToEdit) {
                // وضع التعديل: ملء الحقول بالموجود
                setFormData({ title: noteToEdit.title, content: noteToEdit.content });
            } else {
                // وضع الإضافة: تفريغ الحقول
                setFormData({ title: '', content: '' });
            }
        }
    }, [open, noteToEdit]);

    // التعامل مع التغيير في الحقول
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // دالة الحفظ (إضافة أو تحديث)
    const handleSave = () => {
        if (!formData.title.trim() && !formData.content.trim()) return;

        const randomColor = NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];
        const now = new Date().toLocaleString();

        if (noteToEdit) {
            // منطق التحديث
            const updatedNote: Note = {
                ...noteToEdit,
                title: formData.title,
                content: formData.content,
            };
            dispatch({ type: 'UPDATE_NOTE', payload: updatedNote });
        } else {
            // منطق الإضافة
            const newNote: Note = {
                id: crypto.randomUUID(), // توليد ID فريد
                title: formData.title,
                content: formData.content,
                completed: false,
                color: randomColor,
                date: now,
            };
            dispatch({ type: 'ADD_NOTE', payload: newNote });
        }
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
            <DialogTitle sx={{ bgcolor: 'primary.main', color: 'white' }}>
                {noteToEdit ? 'Edit Note' : 'Create New Note'}
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
                <DialogContentText sx={{ mb: 2 }}>
                    {noteToEdit ? 'Modify your note details below.' : 'Fill in the details to create a new note.'}
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    name="title"
                    label="Title"
                    type="text"
                    fullWidth
                    variant="outlined"
                    value={formData.title}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
                <TextField
                    margin="dense"
                    name="content"
                    label="Content"
                    type="text"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    value={formData.content}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={handleSave} variant="contained" sx={{ px: 4 }}>
                    {noteToEdit ? 'Update' : 'Save'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default NoteDialog;