import { useState } from 'react';
import { Mail, Lock, Pill, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

const mapFirebaseError = (code?: string) => {
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

const RegisterPage: React.FC = () => {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    if (!username.trim()) return setErr('Вкажіть ім’я користувача');
    if (password.length < 6)
      return setErr('Пароль має містити мінімум 6 символів');
    if (password !== confirm) return setErr('Паролі не співпадають');

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
    } catch (e: any) {
      setErr(mapFirebaseError(e?.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Pill className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Реєстрація</h1>
            <p className="text-gray-600">Створіть обліковий запис</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-2">
                Ім’я користувача
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Напр., Оксана"
              />
            </label>

            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-2">
                Електронна пошта
              </span>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@example.com"
                />
              </div>
            </label>

            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-2">
                Пароль
              </span>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="мін. 6 символів"
                />
              </div>
            </label>

            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-2">
                Підтвердіть пароль
              </span>
              <input
                type="password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="повторіть пароль"
              />
            </label>

            {err && <div className="text-sm text-red-600">{err}</div>}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                'Реєстрація…'
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Зареєструватися
                </>
              )}
            </button>

            <div className="text-center text-sm">
              Вже маєте акаунт?{' '}
              <Link to="/login" className="text-blue-600 hover:underline">
                Увійти
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
