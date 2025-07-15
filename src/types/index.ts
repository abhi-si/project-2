export interface User {
  id: string;
  phone: string;
  countryCode: string;
  isAuthenticated: boolean;
}

export interface Chatroom {
  id: string;
  title: string;
  createdAt: string;
  lastMessage?: string;
  messageCount: number;
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: string;
  image?: string;
  chatroomId: string;
}

export interface Country {
  name: {
    common: string;
  };
  idd: {
    root: string;
    suffixes: string[];
  };
  flags: {
    png: string;
  };
  cca2: string;
}

export interface AuthContextType {
  user: User | null;
  login: (phone: string, countryCode: string) => Promise<void>;
  logout: () => void;
  verifyOTP: (otp: string) => Promise<boolean>;
  isLoading: boolean;
  showLogin: () => void;
  showSignup: () => void;
  showHome: () => void;
  authMode: 'home' | 'login' | 'signup' | 'otp';
}

export interface ChatContextType {
  chatrooms: Chatroom[];
  messages: Message[];
  currentChatroom: string | null;
  createChatroom: (title: string) => void;
  deleteChatroom: (id: string) => void;
  sendMessage: (text: string, image?: string) => void;
  loadMessages: (chatroomId: string, page?: number) => void;
  isTyping: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  hasMoreMessages: boolean;
  loadMoreMessages: () => void;
}

export interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export interface ToastContextType {
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}