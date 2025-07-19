import React from 'react';
import CommunityPage from '@/features/forum/components/CommunityPage';
import { WebSocketProvider } from '@/features/forum/contexts/WebSocketContext';

const Community = () => (
  <WebSocketProvider>
    <CommunityPage />
  </WebSocketProvider>
);

export default Community;