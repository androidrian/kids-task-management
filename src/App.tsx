import React, { useState, useEffect } from 'react';
import { Star, Trophy, Sparkles, Plus, LogOut, Settings, Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import TaskList from './components/TaskList';
import RewardModal from './components/RewardModal';
import TaskForm from './components/TaskForm';
import ProfilePhoto from './components/ProfilePhoto';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import AdminPanel from './components/admin/AdminPanel';
import LanguageSwitcher from './components/LanguageSwitcher';
import { Task, User, AuthState, UserConfig } from './types';

function App() {
  const { t } = useTranslation();
  const [childName, setChildName] = useState<string>('');
  const [editingName, setEditingName] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('auth');
    return saved ? JSON.parse(saved) : { user: null, isAuthenticated: false };
  });

  const [showRegister, setShowRegister] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [points, setPoints] = useState(0);
  const [photoUrl, setPhotoUrl] = useState<string>('');
  const [showReward, setShowReward] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    if (auth.user?.id) {
      const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
      const currentUser = users.find(u => u.id === auth.user?.id);
      if (currentUser?.config) {
        setChildName(currentUser.config.childName || '');
        setTasks(currentUser.config.tasks || []);
      }
    }
  }, [auth.user?.id]);

  const saveUserConfig = (config: UserConfig) => {
    if (auth.user?.id) {
      const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
      const updatedUsers = users.map(user => {
        if (user.id === auth.user?.id) {
          return { ...user, config };
        }
        return user;
      });
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  };

  useEffect(() => {
    if (auth.user?.id) {
      saveUserConfig({ childName, tasks });
    }
  }, [childName, tasks, auth.user?.id]);

  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(auth));
  }, [auth]);

  const handleLogin = (user: User) => {
    setAuth({ user, isAuthenticated: true });
  };

  const handleLogout = () => {
    setAuth({ user: null, isAuthenticated: false });
    setShowAdminPanel(false);
    setChildName('');
    setTasks([]);
    setPoints(0);
  };

  const handleTaskComplete = (taskId: number) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId && !task.completed) {
        setPoints(p => p + task.points);
        setShowReward(true);
        return { ...task, completed: true };
      }
      return task;
    }));
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  const handleDeleteTask = (taskId: number) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'completed'>) => {
    if (editingTask) {
      setTasks(prev => prev.map(task => 
        task.id === editingTask.id 
          ? { ...task, ...taskData }
          : task
      ));
    } else {
      const newTask: Task = {
        ...taskData,
        id: Math.max(0, ...tasks.map(t => t.id)) + 1,
        completed: false
      };
      setTasks(prev => [...prev, newTask]);
    }
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const resetTasks = () => {
    setTasks(prev => prev.map(task => ({ ...task, completed: false })));
  };

  if (!auth.isAuthenticated) {
    if (showRegister) {
      return <RegisterForm onRegister={handleLogin} onToggleLogin={() => setShowRegister(false)} />;
    }
    return <LoginForm onLogin={handleLogin} onToggleRegister={() => setShowRegister(true)} />;
  }

  if (showAdminPanel && auth.user?.role === 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-end gap-4 p-4">
            <LanguageSwitcher />
            <button
              onClick={() => setShowAdminPanel(false)}
              className="px-4 py-2 text-purple-600 hover:text-purple-700 font-medium"
            >
              {t('nav.back')}
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" />
              {t('nav.logout')}
            </button>
          </div>
          <AdminPanel />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-purple-100 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-end gap-4 mb-4">
          <LanguageSwitcher />
          {auth.user?.role === 'admin' && (
            <button
              onClick={() => setShowAdminPanel(true)}
              className="text-purple-600 hover:text-purple-700 flex items-center gap-2"
            >
              <Settings className="w-5 h-5" />
              {t('nav.admin')}
            </button>
          )}
          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-700 flex items-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            {t('nav.logout')}
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 mb-8">
          <div className="text-center">
            <ProfilePhoto photoUrl={photoUrl} onPhotoChange={setPhotoUrl} />
            <div className="flex items-center justify-center gap-3 mb-8">
              {editingName ? (
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  onBlur={() => setEditingName(false)}
                  onKeyPress={(e) => e.key === 'Enter' && setEditingName(false)}
                  className="text-3xl sm:text-4xl font-bold text-purple-600 text-center bg-transparent border-b-2 border-purple-300 focus:outline-none focus:border-purple-600"
                  placeholder={t('tasks.childNamePlaceholder')}
                  autoFocus
                />
              ) : (
                <>
                  <h1 className="text-3xl sm:text-4xl font-bold text-purple-600">
                    {childName ? t('tasks.titleWithName', { name: childName }) : t('tasks.title')}
                  </h1>
                  <button
                    onClick={() => setEditingName(true)}
                    className="text-purple-400 hover:text-purple-600 transition-colors"
                  >
                    <Pencil className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
            <button
              onClick={() => setShowTaskForm(true)}
              className="w-full sm:w-auto bg-purple-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-purple-700 transition-colors justify-center"
            >
              <Plus className="w-5 h-5" />
              {t('tasks.new')}
            </button>
            <div className="flex items-center gap-3 bg-purple-50 px-6 py-3 rounded-xl">
              <Trophy className="text-yellow-400 w-6 h-6 sm:w-8 sm:h-8" />
              <span className="text-2xl sm:text-3xl font-bold text-purple-600">{points}</span>
            </div>
          </div>

          <TaskList 
            tasks={tasks} 
            onTaskComplete={handleTaskComplete}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
          />

          {tasks.every(task => task.completed) && tasks.length > 0 && (
            <button
              onClick={resetTasks}
              className="w-full mt-8 bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 rounded-xl text-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 flex items-center justify-center gap-3"
            >
              <Sparkles className="w-6 h-6" />
              {t('tasks.startNewDay')}
            </button>
          )}
        </div>
      </div>

      <RewardModal show={showReward} onClose={() => setShowReward(false)} />
      <TaskForm 
        show={showTaskForm}
        onClose={() => {
          setShowTaskForm(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        task={editingTask}
      />
    </div>
  );
}

export default App;