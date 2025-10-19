
import React, { useState, useEffect, useRef } from 'react';
import { db } from '../services/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { Message, User } from '../types';
import ChatMessage from './ChatMessage';

interface ChatRoomProps {
  roomId: string;
  user: User;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ roomId, user }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [roomName, setRoomName] = useState('');
  const [loading, setLoading] = useState(true);
  const dummy = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    const fetchRoomDetails = async () => {
        const roomDoc = await getDoc(doc(db, 'rooms', roomId));
        if (roomDoc.exists()) {
            setRoomName(roomDoc.data().name);
        }
    };
    fetchRoomDetails();
    
    const messagesCollection = collection(db, 'rooms', roomId, 'messages');
    const q = query(messagesCollection, orderBy('createdAt'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const messagesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as Message));
      setMessages(messagesData);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    dummy.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const { uid, displayName, photoURL } = user;
    
    try {
      await addDoc(collection(db, 'rooms', roomId, 'messages'), {
        text: newMessage,
        createdAt: serverTimestamp(),
        uid,
        displayName,
        photoURL,
      });
      setNewMessage('');
    } catch (error) {
        console.error("Error sending message: ", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="p-4 border-b border-gray-600 shadow-sm">
        <h2 className="text-xl font-bold text-white"># {roomName || 'Chat'}</h2>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading && <div className="text-center text-gray-400">Loading messages...</div>}
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg} currentUserUid={user.uid} />
        ))}
        <div ref={dummy}></div>
      </div>

      <footer className="p-4 border-t border-gray-600">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 text-white bg-gray-600 border border-gray-500 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button type="submit" className="ml-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full transition duration-300 disabled:opacity-50" disabled={!newMessage.trim()}>
            Send
          </button>
        </form>
      </footer>
    </div>
  );
};

export default ChatRoom;
