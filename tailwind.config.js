/** @type {import('tailwindcss').Config} */
export default {
    // تحديد الملفات التي يفحصها Tailwind لاستخراج الكلاسات المستخدمة
    content: [
        "./index.html",
        "./src/**/*.{ts,tsx}",
    ],
    // تفعيل Dark Mode عبر إضافة كلاس 'dark' على عنصر <html>
    darkMode: "class",
    theme: {
        extend: {},
    },
    plugins: [],
}