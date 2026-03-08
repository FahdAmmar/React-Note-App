// src/context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';

// تعريف نوع بيانات الثيم
interface ThemeContextType {
    theme: string;        // اسم الثيم 'light' أو 'dark'
    toggleTheme: () => void; // دالة التبديل
    isDarkMode: boolean;  // حالة منطقية هل الوضع داكن؟
}

// إنشاء الـ Context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// هوك مخصص لاستخدام الثيم
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be used within ThemeProvider');
    return context;
};

// مكون الموفر
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // قراءة الثيم المحفوظ أو استخدام الافتراضي
    const [theme, setTheme] = useState<string>(() => localStorage.getItem('app-theme') || 'light');

    // تحديث سمة الـ HTML وحفظ التفضيل
    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('app-theme', theme);
    }, [theme]);

    // دالة التبديل
    const toggleTheme = () => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode: theme === 'dark' }}>
            {children}
        </ThemeContext.Provider>
    );
};