// =====================================================
// ThemeContext.tsx — Context إدارة الثيم مع localStorage
//
// يتولى هذا الـ Context:
//   1. تحميل تفضيل الثيم من localStorage عند البدء
//   2. حفظ تفضيل الثيم تلقائياً عند كل تبديل
//   3. تطبيق كلاس 'dark' على <html> لتفعيل Tailwind dark mode
//   4. مزامنة ثيم MUI مع تفضيل المستخدم
// =====================================================

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    type ReactNode,
} from "react";

// ─── مفتاح localStorage للثيم ─────────────────────
const THEME_STORAGE_KEY = "noteapp_theme";

// ─── تعريف شكل بيانات الـ Context ─────────────────
interface ThemeContextType {
    isDark: boolean;
    toggleTheme: () => void;
}

// ─── إنشاء الـ Context ────────────────────────────
const ThemeContext = createContext<ThemeContextType>({
    isDark: false,
    toggleTheme: () => { },
});

// ─── Hook مخصص للوصول السهل للثيم ────────────────
export const useTheme = () => useContext(ThemeContext);

// ─── دالة مساعدة: قراءة الثيم المحفوظ ──────────────
// تتحقق أيضاً من تفضيل النظام (prefers-color-scheme)
// إذا لم يكن هناك اختيار محفوظ مسبقاً
const loadThemeFromStorage = (): boolean => {
    try {
        const saved = localStorage.getItem(THEME_STORAGE_KEY);

        // إذا كان هناك اختيار محفوظ → استخدمه
        if (saved !== null) {
            return saved === "dark";
        }

        // لا يوجد اختيار محفوظ → استخدم تفضيل نظام التشغيل
        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    } catch {
        return false; // fallback للوضع الفاتح
    }
};

// ─── دالة مساعدة: تطبيق الثيم على <html> ──────────
// تُضيف/تحذف كلاس 'dark' الذي يفعّل Tailwind dark mode
const applyThemeToDom = (isDark: boolean): void => {
    if (isDark) {
        document.documentElement.classList.add("dark");
    } else {
        document.documentElement.classList.remove("dark");
    }
};

// =====================================================
// Provider المُصدَّر — يغلّف التطبيق بأكمله
// =====================================================
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    // تهيئة الثيم من localStorage أو تفضيل النظام
    const [isDark, setIsDark] = useState<boolean>(() => {
        const savedTheme = loadThemeFromStorage();
        // تطبيق الثيم على DOM فوراً لمنع الوميض (Flash of unstyled content)
        applyThemeToDom(savedTheme);
        return savedTheme;
    });

    // حفظ الثيم في localStorage وتطبيقه على DOM عند كل تغيير
    useEffect(() => {
        applyThemeToDom(isDark);
        try {
            localStorage.setItem(THEME_STORAGE_KEY, isDark ? "dark" : "light");
        } catch (error) {
            console.warn("NoteApp: فشل حفظ الثيم في localStorage:", error);
        }
    }, [isDark]);

    // دالة تبديل الثيم
    const toggleTheme = useCallback(() => {
        setIsDark((prev) => !prev);
    }, []);

    return (
        <ThemeContext.Provider value={{ isDark, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};