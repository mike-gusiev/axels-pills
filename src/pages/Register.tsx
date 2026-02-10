import { useState } from 'react';
import { Mail, Lock, Pill, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

const RegisterPage: React.FC = () => {
  const nav = useNavigate();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const mapFirebaseError = (code?: string) => {
    switch (code) {
      case 'auth/email-already-in-use':
        return t('auth.register.errors.emailInUse');
      case 'auth/invalid-email':
        return t('auth.register.errors.invalidEmail');
      case 'auth/weak-password':
        return t('auth.register.errors.weakPassword');
      default:
        return t('auth.register.errors.default');
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    if (!username.trim())
      return setErr(t('auth.register.errors.usernameRequired'));
    if (password.length < 6)
      return setErr(t('auth.register.errors.passwordLength'));
    if (password !== confirm)
      return setErr(t('auth.register.errors.passwordMismatch'));

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
      nav('/home');
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      setErr(mapFirebaseError(firebaseError?.code));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-6">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mb-4">
              <Pill className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              {t('auth.register.title')}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {t('auth.register.subtitle')}
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <label className="block">
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('auth.register.username')}
              </span>
              <input
                type="text"
                required
                value={username}
                onChange={e => setUsername(e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('auth.register.usernamePlaceholder')}
              />
            </label>

            <label className="block">
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('auth.register.email')}
              </span>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('auth.register.emailPlaceholder')}
                />
              </div>
            </label>

            <label className="block">
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('auth.register.password')}
              </span>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder={t('auth.register.passwordPlaceholder')}
                />
              </div>
            </label>

            <label className="block">
              <span className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('auth.register.confirmPassword')}
              </span>
              <input
                type="password"
                required
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={t('auth.register.confirmPasswordPlaceholder')}
              />
            </label>

            {err && (
              <div className="text-sm text-red-600 dark:text-red-400">
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? (
                t('auth.register.loading')
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  {t('auth.register.registerButton')}
                </>
              )}
            </button>

            <div className="dark:text-white text-center text-sm">
              {t('auth.register.haveAccount')}{' '}
              <Link
                to="/login"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                {t('auth.register.login')}
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
