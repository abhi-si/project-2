import React from 'react';
import { SearchBar } from './SearchBar';
import { ChatroomList } from './ChatroomList';
import { ChatInterface } from '../chat/ChatInterface';
import { useChat } from '../../context/ChatContext';

export const Dashboard: React.FC = () => {
  const { currentChatroom } = useChat();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <div className="hidden lg:flex lg:flex-col lg:w-80">
        <div className="p-4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          <SearchBar />
        </div>
        <ChatroomList />
      </div>
      
      <div className="flex-1 flex flex-col">
        <div className="lg:hidden p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <SearchBar />
        </div>
        
        <div className="lg:hidden">
          <ChatroomList />
        </div>
        
        {currentChatroom ? (
          <ChatInterface />
        ) : (
          <div className="hidden lg:flex flex-1 items-center justify-center bg-gray-50 dark:bg-gray-800">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-2xl">G</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome to Gemini Chat
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Select a chatroom to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};