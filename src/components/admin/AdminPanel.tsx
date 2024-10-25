import React from 'react';
import { User } from '../../types';
import { Calendar, Mail, User as UserIcon, Trash2, Ban } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const AdminPanel: React.FC = () => {
  const { t } = useTranslation();
  const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];

  const handleDeleteUser = (userId: string) => {
    if (confirm(t('admin.confirmDelete'))) {
      const updatedUsers = users.filter(u => u.id !== userId);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      toast.success(t('admin.userDeleted'));
      // Force re-render
      window.location.reload();
    }
  };

  const handleToggleBlock = (userId: string) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, blocked: !user.blocked };
      }
      return user;
    });
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    toast.success(t('admin.userStatusUpdated'));
    // Force re-render
    window.location.reload();
  };

  return (
    <div className="p-4 sm:p-8">
      <h2 className="text-2xl font-bold text-purple-600 mb-6">{t('admin.panel')}</h2>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-purple-50">
                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-600">{t('admin.name')}</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-600">{t('admin.email')}</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-600">{t('admin.role')}</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-600">{t('admin.status')}</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-600">{t('admin.registrationDate')}</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-purple-600">{t('admin.actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className={`hover:bg-gray-50 ${user.blocked ? 'bg-red-50' : ''}`}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <UserIcon className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-900">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {t(`admin.role.${user.role}`)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.blocked ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.blocked ? t('admin.blocked') : t('admin.active')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-600">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.role !== 'admin' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleBlock(user.id)}
                          className={`p-1.5 rounded-lg ${
                            user.blocked
                              ? 'bg-green-100 text-green-600 hover:bg-green-200'
                              : 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                          }`}
                          title={user.blocked ? t('admin.unblock') : t('admin.block')}
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                          title={t('admin.delete')}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;