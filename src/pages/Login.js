import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, Pill } from 'lucide-react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, } from 'firebase/auth';
function mapFirebaseError(code) {
    switch (code) {
        case 'auth/invalid-email':
            return 'Невалідний email.';
        case 'auth/user-disabled':
            return 'Акаунт заблоковано.';
        case 'auth/user-not-found':
            return 'Користувача не знайдено.';
        case 'auth/wrong-password':
            return 'Невірний пароль.';
        case 'auth/email-already-in-use':
            return 'Такий email вже зареєстровано.';
        case 'auth/weak-password':
            return 'Занадто простий пароль (мінімум 6 символів).';
        default:
            return 'Сталася помилка. Спробуйте ще раз.';
    }
}
const LoginPage = ({ onSuccess }) => {
    const [mode, setMode] = useState('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [err, setErr] = useState(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErr(null);
        try {
            if (mode === 'login') {
                await signInWithEmailAndPassword(auth, email, password);
            }
            else {
                await createUserWithEmailAndPassword(auth, email, password);
            }
            onSuccess?.();
        }
        catch (e) {
            setErr(mapFirebaseError(e?.code));
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-6", children: _jsx("div", { className: "max-w-md w-full", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-8", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4", children: _jsx(Pill, { className: "w-8 h-8 text-blue-600" }) }), _jsx("h1", { className: "text-3xl font-bold text-gray-800 mb-2", children: "\u0421\u0438\u0441\u0442\u0435\u043C\u0430 \u0443\u043F\u0440\u0430\u0432\u043B\u0456\u043D\u043D\u044F \u043F\u0440\u0435\u043F\u0430\u0440\u0430\u0442\u0430\u043C\u0438 - Axels Pills Tracker" }), _jsx("p", { className: "text-gray-600", children: mode === 'login'
                                    ? 'Увійдіть до свого облікового запису'
                                    : 'Створіть обліковий запис' })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "\u0415\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u043D\u0430 \u043F\u043E\u0448\u0442\u0430" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Mail, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), required: true, className: "block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "\u0432\u0432\u0435\u0434\u0456\u0442\u044C email" })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-2", children: "\u041F\u0430\u0440\u043E\u043B\u044C" }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none", children: _jsx(Lock, { className: "h-5 w-5 text-gray-400" }) }), _jsx("input", { type: showPassword ? 'text' : 'password', value: password, onChange: (e) => setPassword(e.target.value), required: true, className: "block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "\u0432\u0432\u0435\u0434\u0456\u0442\u044C \u043F\u0430\u0440\u043E\u043B\u044C" }), _jsx("button", { type: "button", className: "absolute inset-y-0 right-0 pr-3 flex items-center", onClick: () => setShowPassword((v) => !v), children: showPassword ? (_jsx(EyeOff, { className: "h-5 w-5 text-gray-400 hover:text-gray-600" })) : (_jsx(Eye, { className: "h-5 w-5 text-gray-400 hover:text-gray-600" })) })] })] }), err && _jsx("div", { className: "text-sm text-red-600", children: err }), _jsx("button", { type: "submit", disabled: isLoading, className: "w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors font-medium", children: isLoading ? (_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" }), mode === 'login' ? 'Вхід...' : 'Реєстрація...'] })) : (_jsxs("div", { className: "flex items-center", children: [_jsx(LogIn, { className: "w-4 h-4 mr-2" }), mode === 'login' ? 'Увійти' : 'Зареєструватися'] })) }), _jsx("button", { type: "button", onClick: () => setMode(mode === 'login' ? 'register' : 'login'), className: "w-full text-sm text-blue-600 hover:underline", children: mode === 'login'
                                    ? 'Немає акаунта? Зареєструватися'
                                    : 'Вже є акаунт? Увійти' })] })] }) }) }));
};
export default LoginPage;
