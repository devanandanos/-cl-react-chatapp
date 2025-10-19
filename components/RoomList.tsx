
import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { Room } from '../types';

interface RoomListProps {
  selectedRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
}

const RoomList: React.FC<RoomListProps> = ({ selectedRoomId, onSelectRoom }) => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const roomsCollection = collection(db, 'rooms');
    const q = query(roomsCollection, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const roomsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Room));
      setRooms(roomsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoomName.trim() === '') return;

    try {
      await addDoc(collection(db, 'rooms'), {
        name: newRoomName.trim(),
        createdAt: serverTimestamp(),
      });
      setNewRoomName('');
    } catch (error) {
      console.error("Error creating room: ", error);
    }
  };

  return (
    <aside className="w-64 bg-gray-900 flex-shrink-0 flex flex-col border-r border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold text-white">Chat Rooms</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {loading ? (
            <div className="p-4 text-gray-400">Loading rooms...</div>
        ) : (
            <ul>
            {rooms.map(room => (
                <li key={room.id}>
                <button
                    onClick={() => onSelectRoom(room.id)}
                    className={`w-full text-left p-3 text-sm transition duration-200 ${
                    selectedRoomId === room.id ? 'bg-blue-600 text-white' : 'hover:bg-gray-700/50 text-gray-300'
                    }`}
                >
                    # {room.name}
                </button>
                </li>
            ))}
            </ul>
        )}
      </div>
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleCreateRoom}>
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="Create new room..."
            className="w-full px-3 py-2 text-sm text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>
      </div>
    </aside>
  );
};

export default RoomList;
