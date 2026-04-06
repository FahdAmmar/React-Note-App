// src/context/SnackbarContext.jsx
import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// 1. إنشاء الـ Context
const SnackbarContext = React.createContext(undefined);

// 2. إنشاء الـ Provider
export function SnackbarProvider({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = React.useState(false);
    const [config, setConfig] = React.useState({
        message: '',
        severity: 'success', // success, error, warning, info
    });

    // دالة لفتح الـ Snackbar مع تحديد الرسالة والنوع
    const showSnackbar = (message, severity = 'success') => {
        setConfig({ message, severity });
        setOpen(true);
    };

    // دالة لإغلاق الـ Snackbar
    const closeSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const value = {
        showSnackbar,
        closeSnackbar,
    };

    return (
        <SnackbarContext.Provider value={value}>
            {children}
            {/* مكون الـ Snackbar يظهر هنا مرة واحدة في أعلى الشجرة */}
            <Snackbar
                open={open}
                autoHideDuration={6000}
                onClose={closeSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // اختياري: لتوسيط الإشعار
            >
                <Alert
                    onClose={closeSnackbar}
                    severity={config.severity}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {config.message}
                </Alert>
            </Snackbar>
        </SnackbarContext.Provider>
    );
}

// 3. إنشاء Hook مخصص للاستخدام
export function useSnackbar() {
    const context = React.useContext(SnackbarContext);
    if (context === undefined) {
        throw new Error('useSnackbar must be used within a SnackbarProvider');
    }
    return context;
}