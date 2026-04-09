// =====================================================
// تعريف أنواع البيانات (TypeScript Interfaces)
// يُستخدم TypeScript لضمان سلامة البيانات في المشروع
// =====================================================

// أنواع الأعمدة الثلاثة في لوحة الملاحظات
export type ColumnType = "start" | "inprogress" | "completed";

// أنواع الأولوية لكل ملاحظة
export type PriorityType = "low" | "medium" | "high";

// أنواع التصنيفات (Tags) المتاحة
export type TagType = "feature" | "bug" | "design" | "docs" | "research";

// واجهة (Interface) تمثل بنية الملاحظة الواحدة
export interface Note {
    id: string;           // معرف فريد للملاحظة
    title: string;        // عنوان الملاحظة
    body: string;         // محتوى/وصف الملاحظة
    tag: TagType;         // تصنيف الملاحظة
    priority: PriorityType; // مستوى الأولوية
    column: ColumnType;   // العمود الذي تنتمي إليه الملاحظة
    createdAt: string;    // تاريخ الإنشاء
}

// واجهة لتمرير خصائص العمود (Column Props)
export interface ColumnConfig {
    id: ColumnType;
    label: string;
    color: string;        // لون النقطة الملونة في رأس العمود
}