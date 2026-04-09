// =====================================================
// Custom Hook لإدارة حالة الملاحظات
// يجمع كل منطق الملاحظات (CRUD) في مكان واحد
// مما يجعل المكونات أنظف وأسهل في الاختبار
// =====================================================

import { useState, useCallback } from "react";
import { type Note, type ColumnType } from "../types/note";
import { v4 as uuidv4 } from "uuid";

// البيانات الافتراضية للعرض الأولي
const initialNotes: Note[] = [
    {
        id: uuidv4(),
        title: "Set up project structure",
        body: "Initialize React Vite with TypeScript, ESLint, and Prettier.",
        tag: "feature",
        priority: "high",
        column: "start",
        createdAt: "Apr 1",
    },
    {
        id: uuidv4(),
        title: "Build drag & drop logic",
        body: "Implement HTML5 Drag API between board columns.",
        tag: "feature",
        priority: "high",
        column: "inprogress",
        createdAt: "Apr 3",
    },
    {
        id: uuidv4(),
        title: "API documentation",
        body: "Write comprehensive docs for all REST endpoints.",
        tag: "docs",
        priority: "low",
        column: "completed",
        createdAt: "Apr 4",
    },
];

export const useNotes = () => {
    // الحالة الرئيسية: مصفوفة الملاحظات
    const [notes, setNotes] = useState<Note[]>(initialNotes);

    // إضافة ملاحظة جديدة
    const addNote = useCallback(
        (data: Omit<Note, "id" | "createdAt" | "column">) => {
            const newNote: Note = {
                ...data,
                id: uuidv4(),
                column: "start", // تبدأ الملاحظة الجديدة دائماً في عمود Start
                createdAt: new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                }),
            };
            setNotes((prev) => [...prev, newNote]);
        },
        []
    );

    // تعديل ملاحظة موجودة
    const updateNote = useCallback(
        (id: string, data: Partial<Omit<Note, "id" | "createdAt">>) => {
            setNotes((prev) =>
                prev.map((note) => (note.id === id ? { ...note, ...data } : note))
            );
        },
        []
    );

    // حذف ملاحظة
    const deleteNote = useCallback((id: string) => {
        setNotes((prev) => prev.filter((note) => note.id !== id));
    }, []);

    // نقل ملاحظة من عمود إلى آخر (السحب والإفلات)
    const moveNote = useCallback((id: string, targetColumn: ColumnType) => {
        setNotes((prev) =>
            prev.map((note) =>
                note.id === id ? { ...note, column: targetColumn } : note
            )
        );
    }, []);

    // فلترة الملاحظات حسب العمود
    const getNotesByColumn = useCallback(
        (column: ColumnType) => notes.filter((n) => n.column === column),
        [notes]
    );

    return { notes, addNote, updateNote, deleteNote, moveNote, getNotesByColumn };
};