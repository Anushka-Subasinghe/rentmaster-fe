import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomerProfilePage from '@/pages/profiles/customer-profile';
import WorkerProfilePage from './worker-profile';
import { appRoutes } from '@/data';
import UserProfileDropdown from './user-profile-dropdown'; // Import the UserProfileDropdown component
import background from "../../assets/profile.png";

export function Profile() {
  const [userDetails, setUserDetails] = useState({});
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const isLogged = localStorage.getItem('isLogged');
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    setUserDetails(userDetails);
    setIsLoggedIn(isLogged === 'true');
  }, []);

  useEffect(() => {
    console.log('isLoggedIn:', isLoggedIn);

    if (!isLoggedIn) {
      console.log('Navigating to home...2');
      navigate(appRoutes.publicRouts.home, { replace: true });
    }
  }, [isLoggedIn]);

  const renderCustomerProfile = () => {
    return (
     
        <CustomerProfilePage userDetails={userDetails} />
    
    );
  };

  const renderWorkerProfile = () => {
    return (
      
        <WorkerProfilePage userDetails={userDetails} />
      
    );
  };

  const handleSignOut = () => {
    localStorage.setItem("isLogged", false);
    localStorage.removeItem('userDetails');
    setIsLoggedIn(false);
  }

  const viewProfile = () => {
    navigate(appRoutes.secureRouts.account, { state: { userDetails } });
  }

  const isCustomer = userDetails.user_type === 'customer';

  return (
    <div
    style={{
      margin: 0,
      background: `url(${background})`,
      backgroundSize: 'cover',
      height: '100vh', // Adjusted to use viewport height
      overflow: 'auto',
    }}
  >
    <nav className="px-4 py-4 h-auto mb-4 w-full flex md:flex-wrap flex-col md:flex-row items-center">
      <div className="flex flex-wrap flex-grow items-center">
        <UserProfileDropdown userDetails={userDetails} handleSignOut={handleSignOut} viewProfile={viewProfile} />
      </div>
    </nav>
    {isCustomer ? renderCustomerProfile() : renderWorkerProfile()}
  </div>
  );
}

export default Profile;
