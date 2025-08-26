import { useState, useEffect } from 'react';

interface UnreadMessage {
  chatId: string;
  count: number;
  lastRead: Date;
}

export const useUnreadMessages = () => {
  const [unreadMessages, setUnreadMessages] = useState<UnreadMessage[]>([]);

  // Mock data - in a real app, this would come from your backend
  useEffect(() => {
    // Simulate some unread messages
    const mockUnread: UnreadMessage[] = [
      {
        chatId: '1',
        count: 2,
        lastRead: new Date(Date.now() - 7200000) // 2 hours ago
      },
      {
        chatId: '2',
        count: 1,
        lastRead: new Date(Date.now() - 3600000) // 1 hour ago
      }
    ];
    setUnreadMessages(mockUnread);

    // Simulate new messages coming in every 30 seconds for demo purposes
    const interval = setInterval(() => {
      setUnreadMessages(prev => {
        const randomChatId = Math.random() > 0.5 ? '1' : '2';
        const existingChat = prev.find(chat => chat.chatId === randomChatId);
        
        if (existingChat) {
          return prev.map(chat => 
            chat.chatId === randomChatId 
              ? { ...chat, count: chat.count + 1 }
              : chat
          );
        } else {
          return [...prev, { chatId: randomChatId, count: 1, lastRead: new Date() }];
        }
      });
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getTotalUnreadCount = () => {
    return unreadMessages.reduce((total, chat) => total + chat.count, 0);
  };

  const markChatAsRead = (chatId: string) => {
    setUnreadMessages(prev => 
      prev.map(chat => 
        chat.chatId === chatId 
          ? { ...chat, count: 0, lastRead: new Date() }
          : chat
      )
    );
  };

  const addUnreadMessage = (chatId: string) => {
    setUnreadMessages(prev => {
      const existingChat = prev.find(chat => chat.chatId === chatId);
      if (existingChat) {
        return prev.map(chat => 
          chat.chatId === chatId 
            ? { ...chat, count: chat.count + 1 }
            : chat
        );
      } else {
        return [...prev, { chatId, count: 1, lastRead: new Date() }];
      }
    });
  };

  return {
    unreadMessages,
    getTotalUnreadCount,
    markChatAsRead,
    addUnreadMessage
  };
};
