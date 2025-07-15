import React, { useState } from 'react';
import { Plus, MessageCircle, Trash2, Calendar } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { CreateChatroomModal } from './CreateChatroomModal';
import { LoadingSkeleton } from '../LoadingSkeleton';

export const ChatroomList: React.FC = () => {
  const { 
    chatrooms, 
    deleteChatroom, 
    loadMessages, 
    currentChatroom,
    searchQuery 
  } = useChat();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const handleDeleteChatroom = (id: string) => {
    if (deleteConfirm === id) {
      deleteChatroom(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full lg:w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Chatrooms
          </h2>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {chatrooms.length === 0 ? (
          <div className="p-8 text-center">
            <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              {searchQuery ? 'No chatrooms found' : 'No chatrooms yet'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
              >
                Create your first chatroom
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            {chatrooms.map(chatroom => (
              <div
                key={chatroom.id}
                className={`p-4 border-b border-gray-100 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                  currentChatroom === chatroom.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                }`}
                onClick={() => loadMessages(chatroom.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                          {chatroom.title}
                        </h3>
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(chatroom.createdAt)}</span>
                          <span>•</span>
                          <span>{chatroom.messageCount} messages</span>
                        </div>
                        {chatroom.lastMessage && (
                          <p className="text-sm text-gray-600 dark:text-gray-300 truncate mt-1">
                            {chatroom.lastMessage}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChatroom(chatroom.id);
                    }}
                    className={`p-2 rounded-lg transition-colors ${
                      deleteConfirm === chatroom.id
                        ? 'bg-red-500 text-white hover:bg-red-600'
                        : 'hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-400 hover:text-red-500'
                    }`}
                    title={deleteConfirm === chatroom.id ? 'Click again to confirm' : 'Delete chatroom'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <CreateChatroomModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};