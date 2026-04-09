// =====================================================
// مكوّن العمود (NoteColumn)
// يمثل عموداً من الأعمدة الثلاثة ويتعامل مع
// أحداث السحب والإفلات (dragover, drop, dragenter)
// =====================================================

import React, { useState, useCallback } from "react";
import { type Note, type ColumnType } from "../types/note";
import NoteCard from "./NoteCard";

interface NoteColumnProps {
    id: ColumnType;
    label: string;
    dotColor: string;
    notes: Note[];
    onEdit: (note: Note) => void;
    onDelete: (id: string) => void;
    onDrop: (noteId: string, targetCol: ColumnType) => void;
}

const NoteColumn: React.FC<NoteColumnProps> = ({
    id, label, dotColor, notes, onEdit, onDelete, onDrop,
}) => {
    // حالة لمعرفة ما إذا كان هناك عنصر يُسحب فوق هذا العمود
    const [isDragOver, setIsDragOver] = useState(false);
    // حالة تتبع معرّف الملاحظة الجارية سحبها
    const [draggingId, setDraggingId] = useState<string | null>(null);

    // حدث عند مرور العنصر المسحوب فوق العمود
    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault(); // ضروري للسماح بالإفلات
        e.dataTransfer.dropEffect = "move";
    };

    // حدث عند دخول العنصر المسحوب إلى العمود
    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    // حدث عند خروج العنصر المسحوب من العمود
    const handleDragLeave = (e: React.DragEvent) => {
        // التحقق من أن المؤشر غادر العمود فعلاً (وليس دخل عنصراً داخله)
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
            setIsDragOver(false);
        }
    };

    // حدث الإفلات: يستخرج معرّف الملاحظة وينقلها
    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const noteId = e.dataTransfer.getData("text/plain");
        if (noteId) onDrop(noteId, id); // تنفيذ دالة النقل من الأب
    };

    const handleDragStart = useCallback(
        (_: React.DragEvent, noteId: string) => setDraggingId(noteId),
        []
    );
    const handleDragEnd = useCallback(() => setDraggingId(null), []);

    return (
        <div
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`
        flex flex-col gap-2.5 p-3.5 rounded-xl min-h-[300px]
        border transition-all duration-200
        ${isDragOver
                    ? "border-blue-400 bg-blue-50 dark:bg-blue-950/30"
                    : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                }
      `}
        >
            {/* رأس العمود */}
            <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                    <span
                        className="w-2 h-2 rounded-full"
                        style={{ background: dotColor }}
                    />
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                        {label}
                    </span>
                </div>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {notes.length}
                </span>
            </div>

            {/* قائمة البطاقات أو رسالة الفراغ */}
            {notes.length === 0 ? (
                <div
                    className={`
            flex-1 flex items-center justify-content-center rounded-lg
            border-2 border-dashed border-gray-200 dark:border-gray-700
            p-5 text-center text-xs text-gray-400
            ${isDragOver ? "border-blue-300" : ""}
          `}
                >
                    Drop notes here
                </div>
            ) : (
                notes.map((note) => (
                    <NoteCard
                        key={note.id}
                        note={note}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                    />
                ))
            )}
        </div>
    );
};

export default NoteColumn;