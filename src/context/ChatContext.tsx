import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChatContextType, Chatroom, Message } from '../types';
import { useToast } from './ToastContext';

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chatrooms, setChatrooms] = useState<Chatroom[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentChatroom, setCurrentChatroom] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const { showToast } = useToast();

  const MESSAGES_PER_PAGE = 20;

  useEffect(() => {
    const savedChatrooms = localStorage.getItem('chatrooms');
    const savedMessages = localStorage.getItem('messages');
    
    if (savedChatrooms) {
      setChatrooms(JSON.parse(savedChatrooms));
    }
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  const saveChatrooms = (newChatrooms: Chatroom[]) => {
    setChatrooms(newChatrooms);
    localStorage.setItem('chatrooms', JSON.stringify(newChatrooms));
  };

  const saveMessages = (newMessages: Message[]) => {
    setMessages(newMessages);
    localStorage.setItem('messages', JSON.stringify(newMessages));
  };

  const createChatroom = (title: string) => {
    const newChatroom: Chatroom = {
      id: Date.now().toString(),
      title,
      createdAt: new Date().toISOString(),
      messageCount: 0
    };
    
    const updatedChatrooms = [...chatrooms, newChatroom];
    saveChatrooms(updatedChatrooms);
    showToast('Chatroom created successfully!', 'success');
  };

  const deleteChatroom = (id: string) => {
    const updatedChatrooms = chatrooms.filter(room => room.id !== id);
    const updatedMessages = messages.filter(msg => msg.chatroomId !== id);
    
    saveChatrooms(updatedChatrooms);
    saveMessages(updatedMessages);
    
    if (currentChatroom === id) {
      setCurrentChatroom(null);
    }
    
    showToast('Chatroom deleted successfully!', 'success');
  };

  const generateAIResponse = (userMessage: string): string => {
    const responses = [
      "That's an interesting perspective! Could you tell me more about that?",
      "I understand what you're saying. Let me think about this for a moment.",
      "That's a great question! Based on what you've shared, I think...",
      "I appreciate you sharing that with me. Here's my thoughts on the matter:",
      "You've raised a really good point. From my understanding...",
      "That's fascinating! I'd love to explore this topic further with you.",
      "I can see why you'd think that. Let me offer a different perspective:",
      "Thank you for that insight. It reminds me of something similar...",
      "That's a complex topic! Let me break it down for you:",
      "I find that really intriguing. What made you think about that?"
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const sendMessage = (text: string, image?: string) => {
    if (!currentChatroom) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date().toISOString(),
      image,
      chatroomId: currentChatroom
    };

    const updatedMessages = [...messages, userMessage];
    saveMessages(updatedMessages);
    showToast('Message sent!', 'success');

    // Update chatroom last message
    const updatedChatrooms = chatrooms.map(room => {
      if (room.id === currentChatroom) {
        return {
          ...room,
          lastMessage: text,
          messageCount: room.messageCount + 1
        };
      }
      return room;
    });
    saveChatrooms(updatedChatrooms);

    // Simulate AI typing
    setIsTyping(true);
    
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(text),
        sender: 'ai',
        timestamp: new Date().toISOString(),
        chatroomId: currentChatroom
      };

      const finalMessages = [...updatedMessages, aiMessage];
      saveMessages(finalMessages);
      setIsTyping(false);
      
      // Update chatroom count again
      const finalChatrooms = chatrooms.map(room => {
        if (room.id === currentChatroom) {
          return {
            ...room,
            messageCount: room.messageCount + 2
          };
        }
        return room;
      });
      saveChatrooms(finalChatrooms);
    }, 1500 + Math.random() * 2000); // 1.5-3.5 seconds delay
  };

  const loadMessages = (chatroomId: string, page = 1) => {
    setCurrentChatroom(chatroomId);
    setCurrentPage(page);
    
    const chatroomMessages = messages.filter(msg => msg.chatroomId === chatroomId);
    const totalPages = Math.ceil(chatroomMessages.length / MESSAGES_PER_PAGE);
    setHasMoreMessages(page < totalPages);
  };

  const loadMoreMessages = () => {
    if (!hasMoreMessages || !currentChatroom) return;
    
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    
    const chatroomMessages = messages.filter(msg => msg.chatroomId === currentChatroom);
    const totalPages = Math.ceil(chatroomMessages.length / MESSAGES_PER_PAGE);
    setHasMoreMessages(nextPage < totalPages);
  };

  const filteredChatrooms = chatrooms.filter(room =>
    room.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <ChatContext.Provider value={{
      chatrooms: filteredChatrooms,
      messages,
      currentChatroom,
      createChatroom,
      deleteChatroom,
      sendMessage,
      loadMessages,
      isTyping,
      searchQuery,
      setSearchQuery,
      hasMoreMessages,
      loadMoreMessages
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};