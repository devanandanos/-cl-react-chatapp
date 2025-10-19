
import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import Login from './components/Login';
import RoomList from './components/RoomList';
import ChatRoom from './components/ChatRoom';
import Header from './components/Header';
import { auth } from './services/firebase';
import { signOut } from 'firebase/auth';

const App: React.FC = () => {
  const { user, loading } = useAuth();
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setSelectedRoomId(null);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-800 text-white">
      <Header user={user} onSignOut={handleSignOut} />
      <div className="flex flex-1 overflow-hidden">
        <RoomList selectedRoomId={selectedRoomId} onSelectRoom={setSelectedRoomId} />
        <main className="flex-1 flex flex-col bg-gray-700">
          {selectedRoomId ? (
            <ChatRoom roomId={selectedRoomId} user={user} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-400">Select a room to start chatting</h2>
                <p className="text-gray-500">Or create a new one!</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
