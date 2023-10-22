import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import background from "../../assets/header.png";
import config from "@/config";
import { toast, ToastContainer } from "react-toastify";
import { appRoutes } from "@/data";

export function TypeSelectPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isCustomer, setIsCustomer] = useState(true);
  const [selectedJobTypes, setSelectedJobTypes] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  // Function to toggle the popup visibility
  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const baseUrl = config.API_BASE_URL;

  const handleSignUp = async () => {
    // Check if all fields are filled
    if (name.length == 0 || email.length == 0 || password.length == 0 || confirmPassword.length == 0) {
      toast.error("Please fill in all the fields.");
      return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    // Check if email is valid
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!isCustomer && selectedJobTypes.length === 0) {
      toast.error("Please select at least one job type.");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/user/check-email/${email}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data) {
        toast.error("An account with this email already exists.");
        return;
      }
    } catch (error) {
      toast.error("An error occurred while checking email availability. Please try again later.");
      console.log("Error signing up:", error);
    }

    try {
      const response = await fetch(`${baseUrl}/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          name: name.trim(),
          email, 
          password,
          user_type: isCustomer ? "customer" : "worker",
          job_types: selectedJobTypes,
        }),
      });

      if (response.ok) {
        const userDetails = await response.json();
        localStorage.setItem("isLogged", JSON.stringify(true));
        localStorage.setItem("userDetails", JSON.stringify(userDetails));
        navigate(appRoutes.secureRouts.myProfile, { state: { userDetails } });
      } else {
        // Handle error response (e.g., incorrect credentials)
        const errorResponse = await response.json();
        console.log(errorResponse);
        toast.error(errorResponse.detail);
      }
    } catch (error) {
      toast.error("An error occurred while signing up. Please try again later.");
      console.log("Error signing up:", error);
    }
  };


  const PopularJobTypesPopup = ({ jobTypes }) => {
    return (
      
      <div className="sidebar-content" style={{position: 'fixed', top: '50vh',right: '200px', width: '300px', height: '100px',  backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '20px', overflowY: 'auto', boxShadow: '-2px 0 5px rgba(0, 0, 0, 0.1)', transform: 'translate(0, -50%)', // Vertically center the sidebar
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center', // Horizontally center the content
      padding: '15px', overflow: false}}>
        <h2 style={{ color: 'green' }}>Popular Job Types</h2>
        <ul>
          {jobTypes.map((jobType, index) => (
            <li key={index}>{jobType}</li>
          ))}
        </ul>
      </div>
    
    );
  };

  const PopularAreasPopup = ({ areas }) => {
    return (
      
      <div className="sidebar-content" style={{marginTop: '20px', position: 'fixed', top: '50vh',right: '200px', width: '300px', height: '100px',  backgroundColor: '#fff', border: '1px solid #ccc', borderRadius: '20px', overflowY: 'auto', boxShadow: '-2px 0 5px rgba(0, 0, 0, 0.1)', transform: 'translate(0, 50%)', // Vertically center the sidebar
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center', // Horizontally center the content
      padding: '15px', overflow: false}}>
        <h2 style={{ color: 'green' }}>Popular Areas</h2>
        <ul>
          {areas.map((area, index) => (
            <li key={index}>{area}</li>
          ))}
        </ul>
      </div>
    
    );
  };


  function generatePopularAreas() {
    const userInteractionData = {
      user1: ["nugegoda", "dehiwala", "moratuwa"],
      user2: ["piliyandala", "dehiwala"],
      user3: ["nugegoda", "piliyandala", "dehiwala", "kollupitiya"],
      // Add more user interactions as needed
    };
    
    const jobTypeCounts = {};
    
    for (const user in userInteractionData) {
      const jobTypes = userInteractionData[user];
      
      for (const jobType of jobTypes) {
        if (jobType in jobTypeCounts) {
          jobTypeCounts[jobType]++;
        } else {
          jobTypeCounts[jobType] = 1;
        }
      }
    }  
    const sortedJobTypes = Object.entries(jobTypeCounts).sort((a, b) => b[1] - a[1]);
  
  // Return the top N popular job types (e.g., top 5)
  const topPopularJobTypes = sortedJobTypes.slice(0, 5).map(([jobType]) => jobType);

  return topPopularJobTypes.filter((value, index) => index == 0 || index == 1);
}

  // Function to generate popular job types based on user interactions
function generatePopularJobTypes() {
  const userInteractionData = {
    user1: ["cleaner", "electrician", "painter"],
    user2: ["plumber", "electrician"],
    user3: ["cleaner", "plumber", "electrician", "gardener"],
    // Add more user interactions as needed
  };
  
  const jobTypeCounts = {};
  
  for (const user in userInteractionData) {
    const jobTypes = userInteractionData[user];
    
    for (const jobType of jobTypes) {
      if (jobType in jobTypeCounts) {
        jobTypeCounts[jobType]++;
      } else {
        jobTypeCounts[jobType] = 1;
      }
    }
  }

  // Sort job types by popularity (count)
  const sortedJobTypes = Object.entries(jobTypeCounts).sort((a, b) => b[1] - a[1]);
  
  // Return the top N popular job types (e.g., top 5)
  const topPopularJobTypes = sortedJobTypes.slice(0, 5).map(([jobType]) => jobType);

  return topPopularJobTypes.filter((value, index) => index == 0 || index == 1);
}

  const navigate = useNavigate();
  return (
    <>
      <div className="absolute inset-0 z-0 h-full w-full" style={{ margin: 0, background: `url(${background})`, backgroundSize: "cover", height: "100vh", overflow: 'auto' }}/>
      <div className="container pt-10 md:pt-10 mx-auto flex flex-wrap flex-col md:flex-row items-center justify-center">
        <form className="bg-gray-900 opacity-75 w-3/4 md:w-1/2 shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4 mt-20" style={{ display: "flex", flexDirection: "column", alignItems: "center"}}>
          <div className="mb-4">
            <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
              <label className="block text-blue-300 py-2 font-bold mb-2" htmlFor="emailaddress">
                Signup for RentMaster
              </label>
            </div>
            <div style={{display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
            <input style={{ width: "400px", marginBottom: "20px", }}
                className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                id="username"
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input style={{ width: "400px", marginBottom: "20px"}}
                className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                id="emailaddress"
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value.replace(/\s/g, ''))}
              />
              <input style={{width: "400px", marginBottom: "20px"}}
                className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value.replace(/\s/g, ''))}
              />
              <input style={{width: "400px"}}
                className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
                id="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value.replace(/\s/g, ''))}
              />
              <div className="flex items-center justify-center mt-4">
                <label className="block text-blue-300 font-bold mr-2" htmlFor="userType">
                  Select user type:
                </label>
                <select
                  id="userType"
                  className="text-gray-700 rounded w-full py-2 pl-2"
                  value={isCustomer ? 'customer' : 'worker'}
                  onChange={(e) => setIsCustomer(e.target.value === 'customer')}
                >
                  <option value="customer">Customer</option>
                  <option value="worker">Worker</option>
                </select>
              </div>
              {/* Dropdown to select job types for a worker */}
              {isCustomer ? null : (
                <div className="flex flex-col mt-4">
                  <div className="flex items-center justify-center mt-4">
                    <label className="block text-blue-300 font-bold mr-2" htmlFor="jobTypes">
                      Select job types:
                    </label>
                    <select
                      id="jobTypes"
                      className="text-gray-700 rounded mr-2"
                      multiple
                      value={selectedJobTypes}
                      onChange={(e) => {
                        e.preventDefault();
                        const selectedValue = e.target.value;
                        setSelectedJobTypes(prevSelectedJobTypes => {
                          if (prevSelectedJobTypes.includes(selectedValue)) {
                            // If the value is already selected, remove it
                            return prevSelectedJobTypes.filter(value => value !== selectedValue);
                          } else {
                            // If the value is not selected, add it
                            return [...prevSelectedJobTypes, selectedValue];
                          }
                        });
                      }}                      
                    >
                      <option value="cleaner">House Cleaner</option>
                      <option value="plumber">Plumber</option>
                      <option value="electrician">Electrician</option>
                      <option value="gardener">Gardener</option>
                      <option value="painter">Painter</option>
                    </select>
                    <button
                      className="bg-red-500 text-white px-2 rounded"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedJobTypes([]);
                      }}
                    >
                      Clear
                    </button>
                  </div>
                  <div className="mt-8 justify-center" style={{height: "3rem"}}>
                    {selectedJobTypes.map((job, index) => (
                      <span key={index} className="mr-2 mb-2 inline-flex items-center bg-gray-200 rounded-full px-3 py-1">
                        {job}
                        <button
                          className="ml-2 text-red-500"
                          onClick={(e) => {
                            e.preventDefault();
                            const updatedJobTypes = selectedJobTypes.filter((_, i) => i !== index);
                            setSelectedJobTypes(updatedJobTypes);
                          }}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <button
              className="bg-gradient-to-r from-purple-800 to-green-500 hover:from-pink-500 hover:to-green-500 text-white font-bold py-2 px-4 rounded focus:ring transform transition hover:scale-105 duration-300 ease-in-out"
              type="button"
              onClick={handleSignUp}
            >
              Sign Up
            </button>
          </div>
        </form>
      </div>
      <ToastContainer position="top-center" autoClose={1000} hideProgressBar />
      {isCustomer ? null : <div>
      <PopularJobTypesPopup jobTypes={generatePopularJobTypes()} />
      <PopularAreasPopup areas={generatePopularAreas()} />
    </div>}
    </>
  );
}

export default TypeSelectPage;