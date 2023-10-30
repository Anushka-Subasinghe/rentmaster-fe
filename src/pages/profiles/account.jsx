import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileNavbar from './profileNavbar';
import placeHolder from "../../assets/profilePlaceHolder.jfif";
import { appRoutes } from '@/data';
import { FaStar, FaRegStar } from 'react-icons/fa';

const generateStars = (rating) => {
  const stars = [];
  const filledStars = Math.floor(rating); // Integer part of the rating
  const remainder = (rating - filledStars) * 100; // Get the remaining percentage

  for (let i = 1; i <= 5; i++) {
      if (i <= filledStars) {
          stars.push(<FaStar key={i} style={{ color: 'gold' }} />);
      } else if (i === filledStars + 1) {
          // Create a partially filled star
          stars.push(
              <div key={i} style={{ display: 'flex' }}>
                  <div style={{ width: `${(remainder / 100) * 24}px`, overflow: 'hidden' }}>
                      <FaStar style={{ color: 'gold' }} />
                  </div>
              </div>
          );
      } else {
          stars.push(<FaRegStar key={i} style={{ color: 'gold' }} />);
      }
  }
  return (
      <div style={{ display: 'flex' }}>
          {stars}
      </div>
  );
};

export function Account () {
    const [userDetails, setUserDetails] = useState({});

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('userDetails'));
    setUserDetails(user);
    console.log(user);
  }, []);

  useEffect(() => {

  }, [userDetails]);

    const navigate = useNavigate();

      const editProfile = (userDetails) => {
        navigate(appRoutes.secureRouts.editProfile);
      }

    return(
        <main className="profile-page">
          <section className="relative block h-500-px">
          <div style={{ marginLeft: '250px' }}>
            <ProfileNavbar currentPage='account' isCustomer={userDetails ? userDetails.user_type == 'customer' : false} />
      </div>
            <div className="top-auto bottom-0 left-0 right-0 w-full absolute pointer-events-none overflow-hidden h-70-px" style={{transform: "translateZ(0px)"}}>
              <svg className="absolute bottom-0 overflow-hidden" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" version="1.1" viewBox="0 0 2560 100" x="0" y="0">
                <polygon className="text-blueGray-200 fill-current" points="2560 0 2560 100 0 100"></polygon>
              </svg>
            </div>
          </section>
          <section className="relative py-16 bg-blueGray-200" style={{minHeight: 'calc(100vh - 500px)'}}>
            <div className="container mx-auto px-4">
              <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64" style={{minHeight: 'calc(100vh - 400px)'}}>
                <div className="px-6">
                  <div className="flex flex-wrap justify-center">
                  <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center mb-20">
                    <div className="relative">
                        <img
                            id='profilePicture'
                            alt="Profile Picture"
                            src={userDetails.profile_picture ? `data:image/png;base64, ${userDetails.profile_picture}` : placeHolder}
                            className="shadow-xl rounded-full h-auto align-middle border-none absolute -m-16 -ml-20 lg:-ml-16 max-w-150-px"
                        />
                        
                    </div>
                  </div>
                    <div className="w-full lg:w-4/12 px-4 lg:order-3 lg:text-right lg:self-center">
                      <div className="py-6 px-3 mt-32 sm:mt-0">
                        <button onClick={() => editProfile(userDetails)} className="bg-pink-500 active:bg-pink-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150" type="button">
                          Edit Profile
                        </button>
                      </div>
                    </div>
                    <div className="w-full lg:w-4/12 px-4 lg:order-1">
                      <div className="flex justify-center py-4 lg:pt-4 pt-8">
                        
                      </div>
                    </div>
                  </div>
                  <div className="text-center mt-12" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <h3 className="text-4xl font-semibold leading-normal mb-2 text-blueGray-700 mb-2">
                        {userDetails.name}
                    </h3>
                    <div className="text-sm leading-normal mt-0 mb-2 text-blueGray-400 font-bold">
                      {userDetails.email}
                    </div>
                    {userDetails.user_type == 'worker' && <div className="mb-2 text-blueGray-600" style={{ marginTop:  userDetails.phone ? 10 : 0}}>
                      <i className="fas fa-briefcase mr-2 text-lg text-blueGray-400"></i>{userDetails.job_types.join(', ')}
                    </div>}
                    {userDetails.phone && <div className="mb-2 text-blueGray-600">
                      <i className="fas fa-phone mr-2 text-lg text-blueGray-400"></i>{userDetails.phone}
                    </div>}
                    {userDetails.user_type == 'worker' && <div className="mb-2 text-blueGray-600">
                      <p className="font-italic mr-2 text-lg" style={{ display: 'flex', alignItems: 'center' }}>Rating:&nbsp;{generateStars(userDetails.rating)}</p>
                    </div>}
                  </div>
                  
                </div>
              </div>
            </div>
          </section>
        </main>
            );
    
}

export default Account;