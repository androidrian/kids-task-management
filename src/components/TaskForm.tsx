import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Task } from '../types';

interface TaskFormProps {
  show: boolean;
  onClose: () => void;
  onSave: (task: Omit<Task, 'id' | 'completed'>) => void;
  task?: Task | null;
}

const TaskForm: React.FC<TaskFormProps> = ({ show, onClose, onSave, task }) => {
  const [title, setTitle] = useState('');
  const [points, setPoints] = useState('3');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setPoints(task.points.toString());
    } else {
      setTitle('');
      setPoints('3');
    }
  }, [task]);

  if (!show) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title: title.trim(),
      points: parseInt(points)
    });
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-bold text-purple-600 mb-6">
          {task ? 'Editar Tarefa' : 'Nova Tarefa'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Nome da Tarefa
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Ex: Arrumar os Brinquedos 🧸"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-1">
              Pontos ⭐
            </label>
            <select
              id="points"
              value={points}
              onChange={(e) => setPoints(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>
                  {value} {value === 1 ? 'ponto' : 'pontos'}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              {task ? 'Guardar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;