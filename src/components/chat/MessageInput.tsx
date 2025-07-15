import React, { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, Smile } from 'lucide-react';
import { messageSchema } from '../../utils/validation';
import { useChat } from '../../context/ChatContext';
import { ImageUpload } from './ImageUpload';

interface MessageInputData {
  text: string;
}

export const MessageInput: React.FC = () => {
  const { sendMessage, currentChatroom } = useChat();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<MessageInputData>({
    resolver: zodResolver(messageSchema)
  });

  const messageText = watch('text');

  const onSubmit = (data: MessageInputData) => {
    if (!currentChatroom) return;
    
    sendMessage(data.text, selectedImage || undefined);
    reset();
    setSelectedImage(null);
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  if (!currentChatroom) {
    return null;
  }

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      {selectedImage && (
        <div className="mb-4">
          <ImageUpload
            image={selectedImage}
            onImageSelect={setSelectedImage}
            onImageRemove={() => setSelectedImage(null)}
          />
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="flex items-end space-x-2">
        <div className="flex space-x-2">
          <ImageUpload
            image={selectedImage}
            onImageSelect={setSelectedImage}
            onImageRemove={() => setSelectedImage(null)}
          />
          
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Emojis"
          >
            <Smile className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1">
          <textarea
            ref={textareaRef}
            {...register('text')}
            placeholder="Type your message..."
            className={`w-full p-3 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
              errors.text 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-gray-300 dark:border-gray-600'
            }`}
            style={{ minHeight: '44px', maxHeight: '120px' }}
            onKeyDown={handleKeyDown}
            onChange={handleTextareaChange}
            rows={1}
          />
          {errors.text && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.text.message}
            </p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={!messageText?.trim()}
          className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};