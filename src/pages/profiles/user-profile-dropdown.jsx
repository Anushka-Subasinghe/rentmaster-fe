import React, { useState } from 'react';
import profileIcon from '../../assets/profileIcon.svg';

const UserProfileDropdown = ({ userDetails, handleSignOut }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleToggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          type="button"
          onClick={handleToggleDropdown}
          className="flex items-center focus:outline-none"
        >
          <img
            className="h-10 w-10 rounded-full bg-gray-300 p-2"
            src={profileIcon}
            alt="Profile Icon"
          />
          <span className="font-semibold text-xl ml-2 text-white">{userDetails.name}</span>
        </button>
      </div>

      {isDropdownOpen && (
        <div className="origin-top-right absolute fixed top-10 left-0 z-50 right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">
            <p className="block px-4 py-2 text-sm text-gray-700">
              Email: {userDetails.email}
            </p>
            <button
              onClick={() => 
                handleSignOut()}
                className=" ml-3 text-center block px-2 py-2 text-sm text-white font-bold rounded bg-red-300 hover:bg-red-400"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfileDropdown;