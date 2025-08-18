import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Mail, Lock, Pill, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
const mapFirebaseError = (code) => {
    switch (code) {
        case 'auth/email-already-in-use':
            return 'Такий email вже зареєстровано';
        case 'auth/invalid-email':
            return 'Невалідний email';
        case 'auth/weak-password':
            return 'Занадто простий пароль (мінімум 6 символів)';
        default:
            return 'Сталася помилка. Спробуйте ще раз';
    }
};
const RegisterPage = () => {
    const nav = useNavigate();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);
    const onSubmit = async (e) => {
        e.preventDefault();
        setErr(null);
        if (!username.trim())
            return setErr('Вкажіть ім’я користувача');
        if (password.length < 6)
            return setErr('Пароль має містити мінімум 6 символів');
        if (password !== confirm)
            return setErr('Паролі не співпадають');
        setLoading(true);
        try {
            const cred = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(cred.user, { displayName: username });
            await setDoc(doc(db, 'users', cred.user.uid), {
                uid: cred.user.uid,
                email: cred.user.email,
                username,
                createdAt: serverTimestamp(),
            });
            nav('/');
        }
        catch (e) {
            setErr(mapFirebaseError(e?.code));
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-6", children: _jsx("div", { className: "max-w-md w-full", children: _jsxs("div", { className: "bg-white rounded-lg shadow-lg p-8", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("div", { className: "mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4", children: _jsx(Pill, { className: "w-8 h-8 text-blue-600" }) }), _jsx("h1", { className: "text-3xl font-bold text-gray-800", children: "\u0420\u0435\u0454\u0441\u0442\u0440\u0430\u0446\u0456\u044F" }), _jsx("p", { className: "text-gray-600", children: "\u0421\u0442\u0432\u043E\u0440\u0456\u0442\u044C \u043E\u0431\u043B\u0456\u043A\u043E\u0432\u0438\u0439 \u0437\u0430\u043F\u0438\u0441" })] }), _jsxs("form", { onSubmit: onSubmit, className: "space-y-5", children: [_jsxs("label", { className: "block", children: [_jsx("span", { className: "block text-sm font-medium text-gray-700 mb-2", children: "\u0406\u043C\u2019\u044F \u043A\u043E\u0440\u0438\u0441\u0442\u0443\u0432\u0430\u0447\u0430" }), _jsx("input", { type: "text", required: true, value: username, onChange: (e) => setUsername(e.target.value), className: "block w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "\u041D\u0430\u043F\u0440., \u041E\u043A\u0441\u0430\u043D\u0430" })] }), _jsxs("label", { className: "block", children: [_jsx("span", { className: "block text-sm font-medium text-gray-700 mb-2", children: "\u0415\u043B\u0435\u043A\u0442\u0440\u043E\u043D\u043D\u0430 \u043F\u043E\u0448\u0442\u0430" }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: "absolute left-3 top-3.5 h-5 w-5 text-gray-400" }), _jsx("input", { type: "email", required: true, value: email, onChange: (e) => setEmail(e.target.value), className: "block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "you@example.com" })] })] }), _jsxs("label", { className: "block", children: [_jsx("span", { className: "block text-sm font-medium text-gray-700 mb-2", children: "\u041F\u0430\u0440\u043E\u043B\u044C" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-3 top-3.5 h-5 w-5 text-gray-400" }), _jsx("input", { type: "password", required: true, value: password, onChange: (e) => setPassword(e.target.value), className: "block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "\u043C\u0456\u043D. 6 \u0441\u0438\u043C\u0432\u043E\u043B\u0456\u0432" })] })] }), _jsxs("label", { className: "block", children: [_jsx("span", { className: "block text-sm font-medium text-gray-700 mb-2", children: "\u041F\u0456\u0434\u0442\u0432\u0435\u0440\u0434\u0456\u0442\u044C \u043F\u0430\u0440\u043E\u043B\u044C" }), _jsx("input", { type: "password", required: true, value: confirm, onChange: (e) => setConfirm(e.target.value), className: "block w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500", placeholder: "\u043F\u043E\u0432\u0442\u043E\u0440\u0456\u0442\u044C \u043F\u0430\u0440\u043E\u043B\u044C" })] }), err && _jsx("div", { className: "text-sm text-red-600", children: err }), _jsx("button", { type: "submit", disabled: loading, className: "w-full flex justify-center items-center py-3 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50", children: loading ? ('Реєстрація…') : (_jsxs(_Fragment, { children: [_jsx(UserPlus, { className: "w-4 h-4 mr-2" }), "\u0417\u0430\u0440\u0435\u0454\u0441\u0442\u0440\u0443\u0432\u0430\u0442\u0438\u0441\u044F"] })) }), _jsxs("div", { className: "text-center text-sm", children: ["\u0412\u0436\u0435 \u043C\u0430\u0454\u0442\u0435 \u0430\u043A\u0430\u0443\u043D\u0442?", ' ', _jsx(Link, { to: "/login", className: "text-blue-600 hover:underline", children: "\u0423\u0432\u0456\u0439\u0442\u0438" })] })] })] }) }) }));
};
export default RegisterPage;
