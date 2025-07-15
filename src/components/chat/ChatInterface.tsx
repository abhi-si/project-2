import React from 'react';
import { ArrowLeft, MoreVertical } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

export const ChatInterface: React.FC = () => {
  const { currentChatroom, chatrooms } = useChat();

  const currentRoom = chatrooms.find(room => room.id === currentChatroom);

  if (!currentRoom) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Chatroom not found</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-800">
      <div className="border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentRoom.title}
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {currentRoom.messageCount} messages
              </p>
            </div>
          </div>
          
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      <MessageList />
      <MessageInput />
    </div>
  );
};