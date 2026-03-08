// src/context/NotesContext.tsx
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Note, NotesAction } from '../types';

// تعريف شكل الحالة العامة للتطبيق
interface NotesState {
    notes: Note[];
}

// الحالة الافتراضية
const initialState: NotesState = {
    notes: [],
};

// === دالة الـ Reducer ===
// هذه الدالة هي "العقل" الذي يقرر كيف تتغير البيانات بناءً على الفعل (Action) القادم
const notesReducer = (state: NotesState, action: NotesAction): NotesState => {
    switch (action.type) {
        case 'SET_NOTES':
            // عند تحميل البيانات من التخزين المحلي
            return { notes: action.payload };

        case 'ADD_NOTE':
            // إضافة الملاحظة الجديدة في بداية المصفوفة
            return { notes: [action.payload, ...state.notes] };

        case 'UPDATE_NOTE':
            // البحث عن الملاحظة وتحديث بياناتها
            return {
                notes: state.notes.map((note) =>
                    note.id === action.payload.id ? action.payload : note
                ),
            };

        case 'DELETE_NOTE':
            // تصفية المصفوفة وحذف الملاحظة التي تطابق الـ ID
            return {
                notes: state.notes.filter((note) => note.id !== action.payload),
            };

        case 'TOGGLE_NOTE':
            // عكس قيمة completed للملاحظة المحددة
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

// إنشاء الـ Context
const NotesContext = createContext<{
    state: NotesState;
    dispatch: React.Dispatch<NotesAction>;
} | null>(null);

// === مكون الموفر (Provider) ===
// يغلف التطبيق لجعل البيانات متاحة لجميع المكونات
export const NotesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(notesReducer, initialState);

    // تحميل البيانات من LocalStorage عند بدء التطبيق
    useEffect(() => {
        const savedNotes = localStorage.getItem('notes-app-data');
        if (savedNotes) {
            try {
                const parsedNotes: Note[] = JSON.parse(savedNotes);
                dispatch({ type: 'SET_NOTES', payload: parsedNotes });
            } catch (error) {
                console.error('Failed to load notes', error);
            }
        }
    }, []);

    // حفظ البيانات تلقائياً في LocalStorage عند أي تغيير في الملاحظات
    useEffect(() => {
        localStorage.setItem('notes-app-data', JSON.stringify(state.notes));
    }, [state.notes]);

    return (
        <NotesContext.Provider value={{ state, dispatch }}>
            {children}
        </NotesContext.Provider>
    );
};

// === هوك مخصص (Custom Hook) ===
// يسهل استدعاء البيانات وأوامر التعديل في أي مكون
export const useNotes = () => {
    const context = useContext(NotesContext);
    if (!context) {
        throw new Error('useNotes must be used within a NotesProvider');
    }
    return context;
};