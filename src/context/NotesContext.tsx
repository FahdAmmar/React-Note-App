import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { Note, NotesAction } from '../types';
// إذا كنت تستخدم react-hot-toast قم بإلغاء تعليق السطر التالي
// import toast from 'react-hot-toast';




// === 1. ثابت موحد لمفتاح التخزين (لمنع التضارب) ===
const STORAGE_KEY = 'notes-app-data';

// === 2. تعريف الحالة والـ Context ===
interface NotesState {
    notes: Note[];
}

const initialState: NotesState = { notes: [] };

interface NotesContextType {
    state: NotesState;
    dispatch: React.Dispatch<NotesAction>;
}

const NotesContext = createContext<NotesContextType | null>(null);

// === 3. دوال مساعدة للتخزين الآمن (مع معالجة الأخطاء وبيئة السيرفر) ===

const saveNotesToStorage = (notes: Note[]) => {
    // التأكد من أن الكود يعمل في المتصفح فقط
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
        console.error('❌ Failed to save notes:', error);
    }
};

const loadNotesFromStorage = (): Note[] => {
    if (typeof window === 'undefined') return [];

    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return [];

        const parsed = JSON.parse(saved);
        // التحقق من أن البيانات مصفوفة صالحة
        if (!Array.isArray(parsed)) return [];

        return parsed;
    } catch (error) {
        console.error('⚠️ Failed to load notes, returning empty array:', error);
        return [];
    }
};

// === 4. الـ Reducer (نقي وبدون تأثيرات جانبية) ===

const notesReducer = (state: NotesState, action: NotesAction): NotesState => {
    switch (action.type) {
        case 'SET_NOTES':
            return { notes: action.payload };

        case 'ADD_NOTE':
            return { notes: [action.payload, ...state.notes] };

        case 'UPDATE_NOTE':
            return {
                notes: state.notes.map((note) =>
                    note.id === action.payload.id ? action.payload : note
                ),
            };

        case 'DELETE_NOTE':
            return {
                notes: state.notes.filter((note) => note.id !== action.payload),
            };

        case 'TOGGLE_NOTE':
            return {
                notes: state.notes.map((note) =>
                    note.id === action.payload
                        ? { ...note, completed: !note.completed }
                        : note
                ),
            };

        default:
            return state;
    }
};

// === 5. مكون الـ Provider ===

export const NotesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(notesReducer, initialState);

    // 🔹 تحميل البيانات عند بدء التشغيل (مرة واحدة)
    useEffect(() => {
        const notes = loadNotesFromStorage();
        if (notes.length > 0) {
            dispatch({ type: 'SET_NOTES', payload: notes });
        }
    }, []);

    // 🔹 الحفظ التلقائي عند أي تغيير في الحالة
    useEffect(() => {
        saveNotesToStorage(state.notes);
    }, [state.notes]);

    return (
        <NotesContext.Provider value={{ state, dispatch }}>
            {children}
        </NotesContext.Provider>
    );
};

// === 6. Custom Hook للاستخدام السهل ===

export const useNotes = () => {
    const context = useContext(NotesContext);
    if (!context) {
        throw new Error('useNotes must be used within a NotesProvider');
    }
    return context;
};