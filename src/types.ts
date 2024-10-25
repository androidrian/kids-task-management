export interface Task {
  id: number;
  title: string;
  completed: boolean;
  points: number;
}

export interface UserConfig {
  childName: string;
  tasks: Task[];
}

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'user';
  createdAt: string;
  blocked?: boolean;
  config?: UserConfig;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}