import { useState, useEffect } from 'react';

interface QuestRequest {
  id: string;
  questId: string;
  questTitle: string;
  requester: string;
  requesterAge: number;
  requesterGender: string;
  requesterBio: string;
  requestMessage: string;
  requestTime: Date;
  status: 'pending' | 'approved' | 'rejected';
}

interface GroupChat {
  id: string;
  title: string;
  participants: string[];
  messages: any[];
  createdAt: Date;
}

export const useQuestRequests = () => {
  const [questRequests, setQuestRequests] = useState<QuestRequest[]>([]);
  const [groupChats, setGroupChats] = useState<GroupChat[]>([]);

  // Mock data - in a real app, this would come from your backend
  useEffect(() => {
    const mockRequests: QuestRequest[] = [
      {
        id: '1',
        questId: 'quest1',
        questTitle: 'Jazz Night at Blue Note',
        requester: 'Emma L.',
        requesterAge: 28,
        requesterGender: 'Female',
        requesterBio: 'Music lover and jazz enthusiast. Looking for new friends to share adventures with!',
        requestMessage: 'Hi! I saw your Jazz Night quest and I\'m really interested in joining. I love jazz music and would love to meet new people who share the same passion.',
        requestTime: new Date(Date.now() - 3600000),
        status: 'pending'
      },
      {
        id: '2',
        questId: 'quest2',
        questTitle: 'Morning Hiking Trail',
        requester: 'Alex K.',
        requesterAge: 32,
        requesterGender: 'Male',
        requesterBio: 'Outdoor enthusiast and fitness lover. Always up for new challenges!',
        requestMessage: 'Hey! I\'m an experienced hiker and would love to join your morning hiking adventure. I\'m an early bird and love sunrise hikes.',
        requestTime: new Date(Date.now() - 7200000),
        status: 'pending'
      },
      {
        id: '3',
        questId: 'quest1',
        questTitle: 'Jazz Night at Blue Note',
        requester: 'David M.',
        requesterAge: 25,
        requesterGender: 'Male',
        requesterBio: 'New to the city and looking to make friends. Love live music!',
        requestMessage: 'I\'m new to the city and would love to join your jazz night! I\'m a big fan of live music and meeting new people.',
        requestTime: new Date(Date.now() - 1800000),
        status: 'approved'
      }
    ];
    setQuestRequests(mockRequests);

    // Create a group chat for the approved request
    const mockGroupChat: GroupChat = {
      id: 'group1',
      title: 'Jazz Night at Blue Note',
      participants: ['You', 'David M.'],
      messages: [
        {
          id: '1',
          sender: 'System',
          message: 'Welcome to the Jazz Night at Blue Note group chat! 🎵',
          timestamp: new Date(Date.now() - 1800000)
        },
        {
          id: '2',
          sender: 'David M.',
          message: 'Thanks for approving my request! I\'m excited for the jazz night!',
          timestamp: new Date(Date.now() - 1700000)
        }
      ],
      createdAt: new Date(Date.now() - 1800000)
    };
    setGroupChats([mockGroupChat]);
  }, []);

  const approveQuestRequest = (requestId: string): string | null => {
    // Find the request before removing it
    const request = questRequests.find(r => r.id === requestId);
    
    // Remove the approved request from the list
    setQuestRequests(prev => prev.filter(r => r.id !== requestId));

    // Create a group chat for the approved request
    if (request) {
      const newGroupChatId = `group-${request.questId}-${Date.now()}`;
      const newGroupChat: GroupChat = {
        id: newGroupChatId,
        title: request.questTitle,
        participants: ['You', request.requester],
        messages: [
          {
            id: '1',
            sender: 'System',
            message: `Welcome to the ${request.questTitle} group chat! 🎉`,
            timestamp: new Date()
          },
          {
            id: '2',
            sender: 'System',
            message: `${request.requester} has joined the quest!`,
            timestamp: new Date()
          },
          {
            id: '3',
            sender: 'System',
            message: `You can now coordinate your adventure together! 🗺️`,
            timestamp: new Date()
          }
        ],
        createdAt: new Date()
      };
      
      setGroupChats(prev => [...prev, newGroupChat]);
      return newGroupChatId;
    }
    return null;
  };

  const rejectQuestRequest = (requestId: string) => {
    setQuestRequests(prev => 
      prev.map(request => 
        request.id === requestId 
          ? { ...request, status: 'rejected' }
          : request
      )
    );
  };

  const getPendingRequests = () => {
    return questRequests.filter(request => request.status === 'pending');
  };

  const getApprovedRequests = () => {
    return questRequests.filter(request => request.status === 'approved');
  };

  return {
    questRequests,
    groupChats,
    approveQuestRequest,
    rejectQuestRequest,
    getPendingRequests,
    getApprovedRequests
  };
};
