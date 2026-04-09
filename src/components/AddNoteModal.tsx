// =====================================================
// مكوّن نافذة الإضافة/التعديل (AddNoteModal)
// يُستخدم لإضافة ملاحظة جديدة أو تعديل ملاحظة موجودة
// يعتمد على MUI Dialog و useForm pattern
// =====================================================

import React, { useState, useEffect } from "react";
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    TextField, Button, Select, MenuItem,
    FormControl, InputLabel, Stack,
} from "@mui/material";
import { type Note, type TagType, type PriorityType } from "../types/note";

interface AddNoteModalProps {
    open: boolean;
    editingNote: Note | null;          // إذا كانت هناك ملاحظة للتعديل
    onClose: () => void;
    onSave: (data: Omit<Note, "id" | "createdAt" | "column">) => void;
    onUpdate: (id: string, data: Partial<Note>) => void;
}

const AddNoteModal: React.FC<AddNoteModalProps> = ({
    open, editingNote, onClose, onSave, onUpdate,
}) => {
    // حالات حقول النموذج
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [tag, setTag] = useState<TagType>("feature");
    const [priority, setPriority] = useState<PriorityType>("medium");

    // ملء الحقول بقيم الملاحظة عند وضع التعديل
    useEffect(() => {
        if (editingNote) {
            setTitle(editingNote.title);
            setBody(editingNote.body);
            setTag(editingNote.tag);
            setPriority(editingNote.priority);
        } else {
            // إعادة ضبط الحقول عند وضع الإضافة
            setTitle("");
            setBody("");
            setTag("feature");
            setPriority("medium");
        }
    }, [editingNote, open]);

    const handleSave = () => {
        if (!title.trim()) return;
        if (editingNote) {
            // وضع التعديل: تحديث الملاحظة الموجودة
            onUpdate(editingNote.id, { title, body, tag, priority });
        } else {
            // وضع الإضافة: إنشاء ملاحظة جديدة
            onSave({ title, body, tag, priority });
        }
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="xs"
            PaperProps={{ sx: { borderRadius: "12px" } }}
        >
            <DialogTitle sx={{ fontSize: 15, fontWeight: 500 }}>
                {editingNote ? "Edit Note" : "Add New Note"}
            </DialogTitle>

            <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                    {/* حقل العنوان */}
                    <TextField
                        label="Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        size="small"
                        fullWidth
                        inputProps={{ maxLength: 60 }}
                    />

                    {/* حقل المحتوى */}
                    <TextField
                        label="Description"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        size="small"
                        fullWidth
                        multiline
                        rows={3}
                        inputProps={{ maxLength: 200 }}
                    />

                    {/* اختيار التصنيف */}
                    <FormControl size="small" fullWidth>
                        <InputLabel>Tag</InputLabel>
                        <Select
                            value={tag}
                            label="Tag"
                            onChange={(e) => setTag(e.target.value as TagType)}
                        >
                            {(["feature", "bug", "design", "docs", "research"] as TagType[]).map(
                                (t) => <MenuItem key={t} value={t}>{t}</MenuItem>
                            )}
                        </Select>
                    </FormControl>

                    {/* اختيار الأولوية */}
                    <FormControl size="small" fullWidth>
                        <InputLabel>Priority</InputLabel>
                        <Select
                            value={priority}
                            label="Priority"
                            onChange={(e) => setPriority(e.target.value as PriorityType)}
                        >
                            <MenuItem value="low">Low</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="high">High</MenuItem>
                        </Select>
                    </FormControl>
                </Stack>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={onClose} size="small">Cancel</Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    size="small"
                    disabled={!title.trim()}
                    sx={{ borderRadius: "8px", textTransform: "none" }}
                >
                    {editingNote ? "Update" : "Save"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddNoteModal;