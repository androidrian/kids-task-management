import React, { useState } from 'react';
import { User } from '../../types';
import { Lock, Mail, Brain, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';
import toast from 'react-hot-toast';

interface LoginFormProps {
  onLogin: (user: User) => void;
  onToggleRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onToggleRegister }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      setError(t('auth.invalidCredentials'));
      return;
    }

    if (user.blocked) {
      setError(t('auth.accountBlocked'));
      return;
    }

    onLogin(user);
    toast.success(t('auth.welcomeBack', { name: user.name }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-100 to-purple-100 p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 p-4 shadow-lg mb-4">
            <Brain className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-purple-600 mb-2 flex items-center justify-center gap-2">
            KidTask
            <Sparkles className="w-8 h-8 text-yellow-400" />
          </h1>
          <p className="text-purple-500 text-lg">{t('app.tagline')}</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-purple-600 mb-6 text-center">{t('auth.login')}</h2>
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.email')}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 w-full px-4 py-2 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {t('auth.password')}
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 w-full px-4 py-2 rounded-lg border border-purple-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/50"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all transform hover:scale-[1.02] font-medium"
            >
              {t('auth.login')}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-gray-600">
            {t('auth.noAccount')}{' '}
            <button
              onClick={onToggleRegister}
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              {t('auth.register')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;