import { useState } from 'react';
import Login from './pages/Login';
import Home from './pages/Home';

export default function App() {
  const [isAuthed, setIsAuthed] = useState(
    () => localStorage.getItem('auth') === '1'
  );

  return isAuthed ? (
    <Home />
  ) : (
    <Login
      onSuccess={() => {
        localStorage.setItem('auth', '1');
        setIsAuthed(true);
      }}
    />
  );
}
