import { jsx as _jsx } from "react/jsx-runtime";
import { useState } from 'react';
import Login from './pages/Login';
import Home from './pages/Home';
export default function App() {
    const [isAuthed, setIsAuthed] = useState(() => localStorage.getItem('auth') === '1');
    return isAuthed ? (_jsx(Home, {})) : (_jsx(Login, { onSuccess: () => {
            localStorage.setItem('auth', '1');
            setIsAuthed(true);
        } }));
}
