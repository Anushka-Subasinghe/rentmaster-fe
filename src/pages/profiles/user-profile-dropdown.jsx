import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar } from '@material-tailwind/react';
import placeHolder from "../../assets/profilePlaceHolder.jfif";
import { appRoutes } from "@/data";

const UserProfileDropdown = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userDetails, setUserDetails] = useState({});

  const navigate = useNavigate();
  
  const handleSignOut = () => {
    localStorage.setItem("isLogged", false);
    localStorage.removeItem('userDetails');
    navigate(appRoutes.publicRouts.home, { replace: true });
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userDetails'));
    setUserDetails(user);
  },[])

  const viewProfile = () => {
    navigate(appRoutes.secureRouts.account, { state: { userDetails } });
  }

  const handleToggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  return (
    <div className="relative inline-block text-left ml-8">
      <div>
        <button
          type="button"
          onClick={handleToggleDropdown}
          className="flex items-center focus:outline-none"
        >
          <Avatar style={{ borderRadius: '30px' }} src={userDetails.profile_picture ? `data:image/png;base64, ${userDetails.profile_picture}` : placeHolder} alt="avatar" size="md" />
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
                viewProfile()}
                className=" ml-3 mb-3 text-center block px-2 py-2 text-sm text-white font-bold rounded bg-green-300 hover:bg-green-400"
            >
              View Profile
            </button>
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