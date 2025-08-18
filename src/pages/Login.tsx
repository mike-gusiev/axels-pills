import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, Pill } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const mapFirebaseError = (code?: string) => {
  switch (code) {
    case 'auth/invalid-email':
      return 'Невалідний email.';
    case 'auth/user-disabled':
      return 'Акаунт заблоковано.';
    case 'auth/user-not-found':
      return 'Користувача не знайдено.';
    case 'auth/wrong-password':
      return 'Невірний пароль.';
    default:
      return 'Сталася помилка. Спробуйте ще раз.';
  }
};

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErr(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/', { replace: true });
    } catch (e: any) {
      setErr(mapFirebaseError(e?.code));
    } finally {
      setIsLoading(false);
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
            <h1 className="text-3xl font-bold text-gray-800">
              Axels Pills Tracker
            </h1>
            <p className="text-gray-600">Увійдіть до свого облікового запису</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-2">
                Електронна пошта
              </span>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@example.com"
                />
              </div>
            </label>

            <label className="block">
              <span className="block text-sm font-medium text-gray-700 mb-2">
                Пароль
              </span>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="введіть пароль"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </label>

            {err && <div className="text-sm text-red-600">{err}</div>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Вхід...
                </div>
              ) : (
                <div className="flex items-center">
                  <LogIn className="w-4 h-4 mr-2" />
                  Увійти
                </div>
              )}
            </button>

            <div className="text-center text-sm">
              Немає акаунта?{' '}
              <Link to="/register" className="text-blue-600 hover:underline">
                Зареєструватися
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
