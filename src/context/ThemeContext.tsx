import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    ReactNode,
} from "react";

/* ================================
   1️⃣ تعريف أنواع الثيم المتاحة
================================ */

export type Theme = "light" | "dark";

/* ================================
   2️⃣ تعريف شكل البيانات داخل Context
================================ */

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    isDarkMode: boolean;
}

/* ================================
   3️⃣ إنشاء Context
   القيمة الافتراضية null لزيادة الأمان
================================ */

const ThemeContext = createContext<ThemeContextType | null>(null);

/* ================================
   4️⃣ Props الخاصة بالـ Provider
================================ */

interface ThemeProviderProps {
    children: ReactNode;
}

/* ================================
   5️⃣ دالة للحصول على الثيم الابتدائي
   - تقرأ من localStorage
   - أو من system preference
================================ */

const getInitialTheme = (): Theme => {
    if (typeof window === "undefined") return "dark";

    const savedTheme = localStorage.getItem("app-theme") as Theme | null;

    if (savedTheme) return savedTheme;

    const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
    ).matches;

    return systemPrefersDark ? "dark" : "light";
};

/* ================================
   6️⃣ Theme Provider
================================ */

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    /* تحديث الثيم في DOM + localStorage */

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem("app-theme", theme);
    }, [theme]);

    /* تبديل الثيم */

    const toggleTheme = () => {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
    };

    /* استخدام useMemo لتقليل re-renders */

    const value = useMemo(
        () => ({
            theme,
            toggleTheme,
            isDarkMode: theme === "dark",
        }),
        [theme]
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

/* ================================
   7️⃣ Custom Hook للوصول للثيم
================================ */

export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }

    return context;
};