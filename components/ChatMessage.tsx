
import React from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
  currentUserUid: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, currentUserUid }) => {
  const { text, uid, displayName, photoURL, createdAt } = message;
  const isSentByCurrentUser = uid === currentUserUid;

  const messageClass = isSentByCurrentUser
    ? 'flex-row-reverse'
    : 'flex-row';
  
  const bubbleClass = isSentByCurrentUser
    ? 'bg-blue-600'
    : 'bg-gray-600';

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate();
    return new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(date);
  };
    
  return (
    <div className={`flex items-start gap-3 ${messageClass}`}>
      <img
        src={photoURL || `https://picsum.photos/seed/${uid}/40/40`}
        alt={displayName}
        className="w-8 h-8 rounded-full border-2 border-gray-500"
      />
      <div className="flex flex-col">
        <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold text-gray-200">{isSentByCurrentUser ? 'You' : displayName}</span>
            <span className="text-xs text-gray-400">{formatTimestamp(createdAt)}</span>
        </div>
        <div className={`mt-1 p-3 rounded-xl max-w-xs md:max-w-md break-words ${bubbleClass}`}>
          <p className="text-white">{text}</p>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
