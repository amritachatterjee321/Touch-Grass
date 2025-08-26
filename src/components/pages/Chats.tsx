import React, { useState } from 'react';
import { MessageCircle, Send, User, CheckCircle, XCircle, Sword, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useUnreadMessages } from '../../hooks/useUnreadMessages';
import { useQuestRequests } from '../../hooks/useQuestRequests';

interface ChatMessage {
  id: string;
  sender: string;
  message: string;
  timestamp: Date;
}

interface Chat {
  id: string;
  participant: string;
  messages: ChatMessage[];
  lastMessage: string;
  lastMessageTime: Date;
  isGroupChat?: boolean;
  participants?: string[];
}



export const Chats: React.FC = () => {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'chats' | 'quests'>('chats');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { unreadMessages, markChatAsRead } = useUnreadMessages();
  const { questRequests, groupChats, approveQuestRequest, rejectQuestRequest } = useQuestRequests();

  // Mock chat data - in a real app, this would come from your backend
  const mockChats: Chat[] = [
    {
      id: '1',
      participant: 'Sarah M.',
      messages: [
        { id: '1', sender: 'Sarah M.', message: 'Hey! Are you still interested in the Jazz Night?', timestamp: new Date(Date.now() - 3600000) },
        { id: '2', sender: 'You', message: 'Yes! I\'m really excited about it!', timestamp: new Date(Date.now() - 1800000) },
        { id: '3', sender: 'Sarah M.', message: 'Great! Let\'s meet at the venue at 7:30 PM', timestamp: new Date(Date.now() - 900000) }
      ],
      lastMessage: 'Great! Let\'s meet at the venue at 7:30 PM',
      lastMessageTime: new Date(Date.now() - 900000)
    },
    {
      id: '2',
      participant: 'Mike T.',
      messages: [
        { id: '1', sender: 'Mike T.', message: 'Hi! I saw you\'re interested in the Food Truck Festival', timestamp: new Date(Date.now() - 7200000) },
        { id: '2', sender: 'You', message: 'Yes! I love trying new foods', timestamp: new Date(Date.now() - 3600000) }
      ],
      lastMessage: 'Yes! I love trying new foods',
      lastMessageTime: new Date(Date.now() - 3600000)
    }
  ];

  // Combine regular chats with group chats
  const allChats = [
    ...mockChats,
    ...groupChats.map(groupChat => ({
      id: groupChat.id,
      participant: groupChat.title,
      messages: groupChat.messages,
      lastMessage: groupChat.messages[groupChat.messages.length - 1]?.message || 'Group chat created',
      lastMessageTime: groupChat.messages[groupChat.messages.length - 1]?.timestamp || groupChat.createdAt,
      isGroupChat: true,
      participants: groupChat.participants
    }))
  ];

  const currentChat = allChats.find(chat => chat.id === selectedChat);

  const handleChatSelect = (chatId: string) => {
    setSelectedChat(chatId);
    markChatAsRead(chatId);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChat) return;
    
    // In a real app, you would send this to your backend
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  const handleQuestRequest = (requestId: string, action: 'approve' | 'reject') => {
    if (action === 'approve') {
      const request = questRequests.find(r => r.id === requestId);
      const newGroupChatId = approveQuestRequest(requestId);
      
      // Show success message
      setSuccessMessage(`Quest request approved! New group chat "${request?.questTitle}" created.`);
      
      // Switch to chats tab after approval and select the new group chat
      setTimeout(() => {
        setActiveTab('chats');
        if (newGroupChatId) {
          setTimeout(() => {
            setSelectedChat(newGroupChatId);
          }, 100); // Small delay to ensure the chat list is updated
        }
        setSuccessMessage(null);
      }, 2000); // Show message for 2 seconds
    } else {
      rejectQuestRequest(requestId);
    }
  };

  if (!user) {
    return (
      <div className="text-center p-8">
        <p className="text-[#4682b4] pixel-perfect">Please log in to view your chats.</p>
      </div>
    );
  }

  if (allChats.length === 0) {
    return (
      <div className="lilac-event-box retro-border p-8 text-center">
        <div className="retro-border bg-white/80 p-6 inline-block mb-6">
          <MessageCircle className="h-16 w-16 text-[#87ceeb] mx-auto mb-4 pixel-perfect" />
        </div>
        <h3 className="text-[#ff6347] text-lg sm:text-xl mb-4 tracking-wide pixel-perfect">
          ~ NO CHATS YET ~
        </h3>
        <p className="text-[#4682b4] text-sm sm:text-base mb-6 pixel-perfect">
          Start joining quests to begin chatting with your adventure companions!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {successMessage && (
        <div className="retro-border bg-[#d4edda] border-[#28a745] p-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="h-5 w-5 text-[#28a745]" />
            <span className="text-[#28a745] font-semibold pixel-perfect">{successMessage}</span>
          </div>
        </div>
      )}
      
      {/* Tab Navigation */}
      <div className="flex gap-2">
        <Button
          onClick={() => setActiveTab('chats')}
          className={`retro-button px-4 py-2 text-[#2d2d2d] transition-all duration-200 ${
            activeTab === 'chats'
              ? 'bg-[#98fb98] border-[#32cd32] shadow-lg transform scale-105'
              : 'bg-[#f0f8ff] border-[#87ceeb] hover:bg-[#98fb98] hover:border-[#32cd32]'
          }`}
        >
          <MessageCircle className="h-4 w-4 mr-2" />
          <span className="pixel-perfect">CHATS</span>
        </Button>
        <Button
          onClick={() => setActiveTab('quests')}
          className={`retro-button px-4 py-2 text-[#2d2d2d] transition-all duration-200 ${
            activeTab === 'quests'
              ? 'bg-[#98fb98] border-[#32cd32] shadow-lg transform scale-105'
              : 'bg-[#f0f8ff] border-[#87ceeb] hover:bg-[#98fb98] hover:border-[#32cd32]'
          }`}
        >
          <Sword className="h-4 w-4 mr-2" />
          <span className="pixel-perfect">QUEST REQUESTS</span>
        </Button>
      </div>

      {activeTab === 'chats' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
          {/* Chat List */}
          <div className="lg:col-span-1 retro-border bg-[#f0f8ff] border-[#87ceeb] p-4">
            <h3 className="text-[#4682b4] text-lg mb-4 pixel-perfect">~ CHATS ~</h3>
        <div className="space-y-2">
          {allChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => handleChatSelect(chat.id)}
              className={`retro-border p-3 cursor-pointer transition-all duration-200 relative ${
                selectedChat === chat.id 
                  ? 'bg-[#98fb98] border-[#32cd32]' 
                  : 'bg-white border-[#87ceeb] hover:bg-[#f0f8ff]'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {chat.isGroupChat ? (
                  <Users className="h-4 w-4 text-[#4682b4]" />
                ) : (
                  <User className="h-4 w-4 text-[#4682b4]" />
                )}
                <span className="font-semibold text-sm pixel-perfect">{chat.participant}</span>
                {/* Unread message indicator */}
                {(() => {
                  const unreadCount = unreadMessages.find(u => u.chatId === chat.id)?.count || 0;
                  return unreadCount > 0 ? (
                    <div className="ml-auto bg-[#ff6347] text-white text-xs font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center">
                      {unreadCount}
                    </div>
                  ) : null;
                })()}
              </div>
              <p className="text-xs text-[#666666] truncate">{chat.lastMessage}</p>
              <p className="text-xs text-[#999999]">
                {chat.lastMessageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="lg:col-span-2 retro-border bg-[#f0f8ff] border-[#87ceeb] p-4 flex flex-col">
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-2 mb-4 pb-2 border-b-2 border-[#87ceeb]">
              {currentChat.isGroupChat ? (
                <Users className="h-5 w-5 text-[#4682b4]" />
              ) : (
                <User className="h-5 w-5 text-[#4682b4]" />
              )}
              <span className="font-semibold text-[#4682b4] pixel-perfect">{currentChat.participant}</span>
              {currentChat.isGroupChat && currentChat.participants && (
                <span className="text-xs text-[#666666] ml-2">
                  ({currentChat.participants.length} members)
                </span>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {currentChat.messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`retro-border p-3 max-w-[70%] ${
                      message.sender === 'You'
                        ? 'bg-[#98fb98] border-[#32cd32]'
                        : 'bg-white border-[#87ceeb]'
                    }`}
                  >
                    <p className="text-sm font-semibold text-[#4682b4] mb-1">
                      {message.sender}
                    </p>
                    <p className="text-sm text-[#2d2d2d]">{message.message}</p>
                    <p className="text-xs text-[#999999] mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 retro-border bg-white border-[#87ceeb]"
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              />
              <Button
                onClick={sendMessage}
                className="retro-button p-2 text-[#2d2d2d] bg-[#98fb98] border-[#32cd32] hover:bg-[#90ee90]"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <MessageCircle className="h-12 w-12 text-[#87ceeb] mx-auto mb-4" />
              <p className="text-[#4682b4] pixel-perfect">Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
        </div>
      ) : (
        /* Quest Requests Section */
        <div className="space-y-4">
          <div className="retro-border bg-[#f0f8ff] border-[#87ceeb] p-4">
            <h3 className="text-[#4682b4] text-lg mb-4 pixel-perfect">~ QUEST REQUESTS ~</h3>
            <p className="text-[#4682b4] text-sm mb-4 pixel-perfect">
              Review and approve requests from adventurers who want to join your quests!
            </p>
            
            {questRequests.filter(r => r.status === 'pending').length === 0 ? (
              <div className="text-center p-8">
                <Sword className="h-12 w-12 text-[#87ceeb] mx-auto mb-4" />
                <p className="text-[#4682b4] pixel-perfect">No pending quest requests!</p>
                <p className="text-[#666666] text-sm mt-2">All requests have been processed.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {questRequests.filter(r => r.status === 'pending').map((request) => (
                  <div
                    key={request.id}
                    className={`retro-border p-4 ${
                      request.status === 'pending'
                        ? 'bg-white border-[#87ceeb]'
                        : request.status === 'approved'
                        ? 'bg-[#d4edda] border-[#28a745]'
                        : 'bg-[#f8d7da] border-[#dc3545]'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-[#4682b4] font-semibold text-sm pixel-perfect mb-1">
                          {request.questTitle}
                        </h4>
                        <div className="flex items-center gap-2 text-xs text-[#666666]">
                          <User className="h-3 w-3" />
                          <span>{request.requester}</span>
                          <span>•</span>
                          <span>{request.requesterAge} years old</span>
                          <span>•</span>
                          <span>{request.requesterGender}</span>
                        </div>
                      </div>
                      <div className="text-xs text-[#999999]">
                        {request.requestTime.toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <p className="text-xs text-[#4682b4] font-semibold mb-1">About {request.requester}:</p>
                      <p className="text-xs text-[#666666] mb-2">{request.requesterBio}</p>
                      <p className="text-xs text-[#4682b4] font-semibold mb-1">Request Message:</p>
                      <p className="text-xs text-[#666666]">{request.requestMessage}</p>
                    </div>
                    
                    {request.status === 'pending' ? (
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleQuestRequest(request.id, 'approve')}
                          className="retro-button px-3 py-1 text-xs bg-[#28a745] border-[#1e7e34] hover:bg-[#218838] text-white"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          <span className="pixel-perfect">APPROVE</span>
                        </Button>
                        <Button
                          onClick={() => handleQuestRequest(request.id, 'reject')}
                          className="retro-button px-3 py-1 text-xs bg-[#dc3545] border-[#c82333] hover:bg-[#c82333] text-white"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          <span className="pixel-perfect">REJECT</span>
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {request.status === 'approved' ? (
                          <>
                            <CheckCircle className="h-4 w-4 text-[#28a745]" />
                            <span className="text-xs text-[#28a745] font-semibold pixel-perfect">APPROVED</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="h-4 w-4 text-[#dc3545]" />
                            <span className="text-xs text-[#dc3545] font-semibold pixel-perfect">REJECTED</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

