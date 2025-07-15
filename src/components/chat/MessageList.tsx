import React, { useEffect, useRef, useState } from 'react';
import { User, Bot, Copy, Check, ChevronUp } from 'lucide-react';
import { useChat } from '../../context/ChatContext';
import { LoadingSkeleton } from '../LoadingSkeleton';
import { TypingIndicator } from './TypingIndicator';

export const MessageList: React.FC = () => {
  const { 
    messages, 
    currentChatroom, 
    isTyping, 
    hasMoreMessages, 
    loadMoreMessages 
  } = useChat();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showLoadMore, setShowLoadMore] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const currentMessages = messages.filter(msg => msg.chatroomId === currentChatroom);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [currentMessages, isTyping]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearTop = scrollTop < 100;
      setShowLoadMore(isNearTop && hasMoreMessages);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [hasMoreMessages]);

  const handleCopy = async (text: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(messageId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!currentChatroom) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Select a chatroom to view messages</p>
      </div>
    );
  }

  return (
    <div 
      ref={messagesContainerRef}
      className="flex-1 overflow-y-auto p-4 space-y-4 relative"
    >
      {showLoadMore && (
        <button
          onClick={loadMoreMessages}
          className="sticky top-0 z-10 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
        >
          <ChevronUp className="w-4 h-4" />
          <span>Load more messages</span>
        </button>
      )}

      {currentMessages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-2">
              Start a conversation with Gemini
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Ask anything and get intelligent responses
            </p>
          </div>
        </div>
      ) : (
        <>
          {currentMessages.map(message => (
            <div
              key={message.id}
              className={`flex items-start space-x-3 group ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.sender === 'ai' && (
                <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-4 h-4 text-white" />
                </div>
              )}
              
              <div className={`max-w-xs lg:max-w-md xl:max-w-lg relative ${
                message.sender === 'user' ? 'order-1' : 'order-2'
              }`}>
                <div className={`rounded-2xl px-4 py-2 ${
                  message.sender === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}>
                  {message.image && (
                    <img
                      src={message.image}
                      alt="Shared image"
                      className="rounded-lg mb-2 max-w-full h-auto"
                    />
                  )}
                  <p className="text-sm">{message.text}</p>
                </div>
                
                <div className={`flex items-center space-x-2 mt-1 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatTime(message.timestamp)}
                  </span>
                  <button
                    onClick={() => handleCopy(message.text, message.id)}
                    className="opacity-0 group-hover:opacity-100 p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all"
                    title="Copy message"
                  >
                    {copiedId === message.id ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>
              
              {message.sender === 'user' && (
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {isTyping && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};