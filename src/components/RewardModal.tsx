import React, { useEffect, useState } from 'react';
import { Star, Trophy } from 'lucide-react';

interface RewardModalProps {
  show: boolean;
  onClose: () => void;
}

const RewardModal: React.FC<RewardModalProps> = ({ show, onClose }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (show) {
      setAnimate(true);
      const timer = setTimeout(() => {
        setAnimate(false);
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black bg-opacity-40" />
      <div className={`relative transform transition-all duration-500 ${
        animate ? 'scale-110' : 'scale-90'
      }`}>
        <div className="bg-white rounded-2xl p-12 text-center shadow-2xl">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Trophy className="w-24 h-24 text-yellow-400" />
              <Star className={`absolute -top-3 -right-3 w-8 h-8 text-yellow-400 transform ${
                animate ? 'animate-ping' : ''
              }`} />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-purple-600 mb-3">
            Incrível! 🎉
          </h2>
          <p className="text-xl text-purple-500">
            Completaste mais uma tarefa!
          </p>
        </div>
      </div>
    </div>
  );
}

export default RewardModal;