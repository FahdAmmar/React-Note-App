// =====================================================
// useNotes.ts — Custom Hook لإدارة الملاحظات مع localStorage
//
// يتولى هذا الـ Hook:
//   1. تحميل الملاحظات من localStorage عند بدء التطبيق
//   2. حفظ أي تغيير تلقائياً في localStorage
//   3. توفير دوال CRUD كاملة (إضافة، تعديل، حذف، نقل)
//
// آلية العمل مع localStorage:
//   - القراءة: تتم مرة واحدة فقط عند تهيئة الـ state
//   - الكتابة: تتم عبر useEffect كلما تغيّرت قائمة الملاحظات
// =====================================================

import { useState, useEffect, useCallback } from "react";
import { v4 as uuidv4 } from "uuid";
import { type Note, type ColumnType } from "../types/note";

// ─── ثابت مفتاح التخزين ───────────────────────────────
// استخدام ثابت يمنع الأخطاء الإملائية عند القراءة والكتابة
const STORAGE_KEY = "noteapp_notes";

// ─── البيانات الافتراضية ──────────────────────────────
// تُستخدم فقط عند أول تشغيل للتطبيق (لا يوجد بيانات محفوظة)
const DEFAULT_NOTES: Note[] = [
    {
        id: uuidv4(),
        title: "Set up project structure",
        body: "Initialize React Vite with TypeScript, ESLint, and Prettier.",
        tag: "feature",
        priority: "high",
        column: "start",
        createdAt: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        }),
    },
    {
        id: uuidv4(),
        title: "Build drag & drop logic",
        body: "Implement HTML5 Drag API between board columns.",
        tag: "feature",
        priority: "high",
        column: "inprogress",
        createdAt: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        }),
    },
    {
        id: uuidv4(),
        title: "API documentation",
        body: "Write comprehensive docs for all REST endpoints.",
        tag: "docs",
        priority: "low",
        column: "completed",
        createdAt: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
        }),
    },
];

// ─── دالة مساعدة: قراءة الملاحظات من localStorage ────
// تُستدعى مرة واحدة فقط كقيمة ابتدائية لـ useState
// إذا لم تكن هناك بيانات محفوظة → ترجع DEFAULT_NOTES
const loadNotesFromStorage = (): Note[] => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);

        // لا توجد بيانات محفوظة → أول تشغيل للتطبيق
        if (!raw) return DEFAULT_NOTES;

        const parsed = JSON.parse(raw);

        // التحقق من أن البيانات المحفوظة مصفوفة صالحة
        if (!Array.isArray(parsed)) return DEFAULT_NOTES;

        return parsed as Note[];
    } catch (error) {
        // في حالة تلف البيانات المحفوظة → نبدأ من جديد
        console.warn("NoteApp: فشل تحميل البيانات من localStorage:", error);
        return DEFAULT_NOTES;
    }
};

// ─── دالة مساعدة: حفظ الملاحظات في localStorage ──────
const saveNotesToStorage = (notes: Note[]): void => {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
        // قد يحدث هذا إذا كان localStorage ممتلئاً (5MB حد أقصى)
        console.error("NoteApp: فشل حفظ البيانات في localStorage:", error);
    }
};

// =====================================================
// الـ Hook الرئيسي
// =====================================================
export const useNotes = () => {
    // ─── تهيئة الـ State ─────────────────────────────
    // useState يقبل دالة (lazy initializer) تُنفَّذ مرة واحدة فقط
    // هذا أكفأ من استدعاء loadNotesFromStorage() مباشرةً
    // لأنه لا يُعيد تنفيذ القراءة من localStorage في كل render
    const [notes, setNotes] = useState<Note[]>(loadNotesFromStorage);

    // ─── الحفظ التلقائي عند كل تغيير ────────────────
    // useEffect يراقب قائمة الملاحظات
    // وعند أي تغيير فيها يحفظها تلقائياً في localStorage
    useEffect(() => {
        saveNotesToStorage(notes);
    }, [notes]); // تنفيذ التأثير فقط عند تغيير notes

    // ─── إضافة ملاحظة جديدة ──────────────────────────
    // Omit<Note, ...> يعني: جميع حقول Note ما عدا الحقول المذكورة
    // لأن id و createdAt و column تُولَّد تلقائياً
    const addNote = useCallback(
        (data: Omit<Note, "id" | "createdAt" | "column">) => {
            const newNote: Note = {
                ...data,
                id: uuidv4(),                    // معرّف فريد
                column: "start",                 // الملاحظات الجديدة تبدأ في Start
                createdAt: new Date().toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                }),
            };
            // إضافة الملاحظة الجديدة في نهاية القائمة
            setNotes((prev) => [...prev, newNote]);
        },
        []
    );

    // ─── تعديل ملاحظة موجودة ─────────────────────────
    // Partial<...> يعني: أي عدد من الحقول (لا يجب إرسال جميعها)
    const updateNote = useCallback(
        (id: string, data: Partial<Omit<Note, "id" | "createdAt">>) => {
            setNotes((prev) =>
                prev.map((note) =>
                    note.id === id
                        ? { ...note, ...data }  // دمج البيانات الجديدة مع القديمة
                        : note
                )
            );
        },
        []
    );

    // ─── حذف ملاحظة ──────────────────────────────────
    const deleteNote = useCallback((id: string) => {
        setNotes((prev) => prev.filter((note) => note.id !== id));
    }, []);

    // ─── نقل ملاحظة بين الأعمدة (السحب والإفلات) ────
    const moveNote = useCallback((id: string, targetColumn: ColumnType) => {
        setNotes((prev) =>
            prev.map((note) =>
                note.id === id
                    ? { ...note, column: targetColumn }
                    : note
            )
        );
    }, []);

    // ─── جلب ملاحظات عمود معين ───────────────────────
    const getNotesByColumn = useCallback(
        (column: ColumnType) => notes.filter((n) => n.column === column),
        [notes]
    );

    // ─── مسح جميع الملاحظات وإعادة الضبط ─────────────
    // مفيد لزر "Clear All" أو إعادة الضبط
    const clearAllNotes = useCallback(() => {
        setNotes([]);
        localStorage.removeItem(STORAGE_KEY);
    }, []);

    // ─── تصدير عدد الملاحظات لكل عمود ───────────────
    // يُستخدم في شريط الإحصائيات
    const notesCount = {
        start: notes.filter((n) => n.column === "start").length,
        inprogress: notes.filter((n) => n.column === "inprogress").length,
        completed: notes.filter((n) => n.column === "completed").length,
        total: notes.length,
    };

    return {
        notes,
        addNote,
        updateNote,
        deleteNote,
        moveNote,
        getNotesByColumn,
        clearAllNotes,
        notesCount,
    };
};