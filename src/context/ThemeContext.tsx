// =====================================================
// Context لإدارة الثيم (Light / Dark Mode)
// يُتيح هذا الـ Context مشاركة حالة الثيم
// بين جميع مكونات التطبيق دون تمرير props يدوياً
// =====================================================

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    type ReactNode,
} from "react";

// تعريف شكل بيانات الـ Context
interface ThemeContextType {
    isDark: boolean;          // هل الوضع الداكن مفعّل؟
    toggleTheme: () => void;  // دالة تبديل الثيم
}

// إنشاء الـ Context مع قيمة افتراضية
const ThemeContext = createContext<ThemeContextType>({
    isDark: false,
    toggleTheme: () => { },
});

// Hook مخصص للوصول إلى الثيم من أي مكون
export const useTheme = () => useContext(ThemeContext);

// Provider يُغلّف التطبيق بأكمله لتوفير بيانات الثيم
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    // حالة الثيم - false تعني Light Mode
    const [isDark, setIsDark] = useState(false);

    // دالة تبديل الثيم مع useCallback لتجنب إعادة الإنشاء غير الضرورية
    const toggleTheme = useCallback(() => {
        setIsDark((prev) => {
            const next = !prev;
            // تطبيق كلاس Tailwind على عنصر <html> لتفعيل Dark Mode
            if (next) {
                document.documentElement.classList.add("dark");
            } else {
                document.documentElement.classList.remove("dark");
            }
            return next;
        });
    }, []);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};