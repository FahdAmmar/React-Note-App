// src/types/index.ts

// تعريف شكل بيانات الملاحظة
export interface Note {
    id: string;
    title: string;
    content: string;
    completed: boolean; // تم تصحيح التسمية من complated
    color: string;
    date: string;
}

// تعريف أنواع الإجراءات (Actions) التي يتعامل معها الـ Reducer
export type NotesAction =
    | { type: 'SET_NOTES'; payload: Note[] }       // تحميل كافة الملاحظات
    | { type: 'ADD_NOTE'; payload: Note }          // إضافة ملاحظة جديدة
    | { type: 'UPDATE_NOTE'; payload: Note }       // تعديل ملاحظة موجودة
    | { type: 'DELETE_NOTE'; payload: string }     // حذف ملاحظة (نستخدم ID فقط)
    | { type: 'TOGGLE_NOTE'; payload: string };    // تغيير حالة الملاحظة (مكتملة/غير مكتملة)