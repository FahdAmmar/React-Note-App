// =====================================================
// مكوّن بطاقة الملاحظة (NoteCard)
// يعرض ملاحظة واحدة ويدعم السحب والإفلات
// =====================================================

import React, { useState } from "react";
import { Card, CardContent, Chip, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { type Note } from "../types/note";

// خرائط الألوان للتصنيفات والأولويات
const TAG_COLORS = {
    feature: { bg: "bg-blue-100 dark:bg-blue-900/30", text: "text-blue-700 dark:text-blue-300" },
    bug: { bg: "bg-red-100 dark:bg-red-900/30", text: "text-red-700 dark:text-red-300" },
    design: { bg: "bg-purple-100 dark:bg-purple-900/30", text: "text-purple-700 dark:text-purple-300" },
    docs: { bg: "bg-green-100 dark:bg-green-900/30", text: "text-green-700 dark:text-green-300" },
    research: { bg: "bg-amber-100 dark:bg-amber-900/30", text: "text-amber-700 dark:text-amber-300" },
};

const PRIORITY_ICONS = {
    low: { icon: "↓", color: "text-slate-400" },
    medium: { icon: "→", color: "text-amber-500" },
    high: { icon: "↑", color: "text-red-500" },
};

interface NoteCardProps {
    note: Note;
    onEdit: (note: Note) => void;
    onDelete: (id: string) => void;
    onDragStart: (e: React.DragEvent, id: string) => void;
    onDragEnd: (e: React.DragEvent) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
    note,
    onEdit,
    onDelete,
    onDragStart,
    onDragEnd,
}) => {
    // حالة محلية لتتبع ما إذا كانت البطاقة قيد السحب
    const [isDragging, setIsDragging] = useState(false);

    const tagStyle = TAG_COLORS[note.tag];
    const priStyle = PRIORITY_ICONS[note.priority];

    const handleDragStart = (e: React.DragEvent) => {
        setIsDragging(true);
        onDragStart(e, note.id);
        // تعيين البيانات المنقولة عند بدء السحب
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", note.id);
    };

    const handleDragEnd = (e: React.DragEvent) => {
        setIsDragging(false);
        onDragEnd(e);
    };

    return (
        <Card
            draggable // تمكين HTML5 Drag API على البطاقة
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            className={`
        cursor-grab active:cursor-grabbing
        transition-all duration-150
        dark:bg-gray-800 dark:border-gray-700
        hover:border-blue-300 dark:hover:border-blue-600
        ${isDragging ? "opacity-40 scale-95" : "opacity-100"}
      `}
            variant="outlined"
            sx={{
                borderRadius: "10px",
                userSelect: "none", // منع تحديد النص أثناء السحب
            }}
        >
            <CardContent sx={{ p: "12px 14px !important" }}>
                {/* رأس البطاقة: العنوان + التصنيف */}
                <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100 leading-snug">
                        {note.title}
                    </span>
                    <span
                        className={`
              text-[10px] font-semibold px-2 py-0.5 rounded-full
              shrink-0 ${tagStyle.bg} ${tagStyle.text}
            `}
                    >
                        {note.tag}
                    </span>
                </div>

                {/* محتوى الملاحظة */}
                {note.body && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
                        {note.body}
                    </p>
                )}

                {/* ذيل البطاقة: التاريخ + الأولوية + الأزرار */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] text-gray-400">{note.createdAt}</span>
                        <span className={`text-[10px] font-semibold ${priStyle.color}`}>
                            {priStyle.icon} {note.priority}
                        </span>
                    </div>

                    <div className="flex gap-1">
                        <Tooltip title="Edit note">
                            <IconButton
                                size="small"
                                onClick={() => onEdit(note)}
                                sx={{ width: 24, height: 24 }}
                            >
                                <EditIcon sx={{ fontSize: 13 }} />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete note">
                            <IconButton
                                size="small"
                                onClick={() => onDelete(note.id)}
                                sx={{ width: 24, height: 24 }}
                            >
                                <DeleteIcon sx={{ fontSize: 13 }} />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default NoteCard;