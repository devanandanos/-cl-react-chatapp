
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User;
  onSignOut: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onSignOut }) => {
  return (
    <header className="flex items-center justify-between p-4 bg-gray-900/70 backdrop-blur-sm border-b border-gray-700 shadow-md">
      <h1 className="text-xl font-bold text-white">React Firebase Chat</h1>
      <div className="flex items-center">
        <div className="flex items-center mr-4">
          <img
            src={user.photoURL || `https://picsum.photos/seed/${user.uid}/40/40`}
            alt={user.displayName || 'User Avatar'}
            className="w-8 h-8 rounded-full mr-2 border-2 border-gray-600"
          />
          <span className="text-sm font-medium text-gray-300 hidden sm:block">
            {user.displayName || user.email}
          </span>
        </div>
        <button
          onClick={onSignOut}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded-md text-sm transition duration-300"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
};

export default Header;
