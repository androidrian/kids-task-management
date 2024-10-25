import React from 'react';
import { CheckCircle2, Circle, Pencil, Trash2 } from 'lucide-react';
import { Task } from '../types';

interface TaskListProps {
  tasks: Task[];
  onTaskComplete: (id: number) => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (id: number) => void;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskComplete, onEditTask, onDeleteTask }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`relative p-4 rounded-xl transition-all transform hover:scale-102 flex flex-col h-48 group ${
            task.completed
              ? 'bg-green-100 text-green-800'
              : 'bg-purple-50 hover:bg-purple-100 text-purple-800'
          }`}
        >
          <button
            onClick={() => !task.completed && onTaskComplete(task.id)}
            className="absolute inset-0 z-10"
            aria-label={`Complete task: ${task.title}`}
          />
          
          <div className="flex-1">
            <span className="text-lg font-medium leading-tight block mb-2">{task.title}</span>
          </div>

          <div className="flex flex-col items-center gap-3 mb-2">
            {task.completed ? (
              <CheckCircle2 className="w-12 h-12 text-green-600 flex-shrink-0" />
            ) : (
              <Circle className="w-12 h-12 text-purple-600 flex-shrink-0" />
            )}
          </div>

          <div className="flex justify-between items-center">
            <span className="bg-white px-3 py-1.5 rounded-full text-sm font-semibold">
              +{task.points} ⭐
            </span>
            <div className="flex gap-2 z-20">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEditTask(task);
                }}
                className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Edit task"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteTask(task.id);
                }}
                className="p-1.5 rounded-lg bg-white/80 hover:bg-white text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Delete task"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;