import React, {useEffect, useState} from 'react';
import { Typography, Input, Button, Card, CardBody } from '@material-tailwind/react';
import config from "@/config";
import moment from 'moment-timezone';
import { FaStar, FaRegStar } from 'react-icons/fa';
import popup from '../../assets/popup.jpg';

const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        position => {
          const coords = position.coords;
          const latitude = coords.latitude;
          const longitude = coords.longitude;
          resolve({ latitude, longitude });
        },
        error => {
          reject(error);
        }
      );
    });
  };

const CustomerJobRequestForm = ({ userDetails, toggleView }) => {
    const [jobType, setJobType] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');
    const [location, setLocation] = useState([0, 0]);

    const getWeatherForecast = async () => {
  
      const timeZone = 'Asia/Kolkata';
  
      // Combine the date and time and format it
      const combinedDateTime = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm').tz(timeZone);
    
      // Convert the combined date and time to a Unix timestamp (in seconds)
      const timestamp = combinedDateTime.unix();
  
      const apiKey = "38bde97caffcf4daa9adbfedb5fee58f";
      const apiUrl = `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${location[0]}&lon=${location[1]}&dt=${timestamp}&appid=${apiKey}`;
      
      try {
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          // Assuming the jobDate is in YYYY-MM-DD format
          const jobForecast = data.data[0].weather[0].main;
          return jobForecast;
        } else {
          console.error("Failed to fetch weather forecast");
          return null;
        }
      } catch (error) {
        console.error("Error fetching weather forecast:", error);
        return null;
      }
    };

    useEffect(() => {
        getCurrentLocation()
  .then(location => {
    console.log(location.latitude, location.longitude);
    setLocation([location.latitude, location.longitude]);
  })
  .catch(error => {
    console.error('Error getting location:', error);
  });
      }, []);

    const baseUrl = config.API_BASE_URL;  

    const handleViewRequestForm = () => {
        // Toggle the view to show the job request form
        toggleView();
      };

    const getCurrentDate = () => {
        const today = new Date();
        const month = today.getMonth() + 1 < 10 ? `0${today.getMonth() + 1}` : today.getMonth() + 1;
        const day = today.getDate() < 10 ? `0${today.getDate()}` : today.getDate();
        return `${today.getFullYear()}-${month}-${day}`;
    };

    const getMaxDate = () => {
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 3);

        // Convert maxDate to a string in the format 'YYYY-MM-DD'
        const formattedMaxDate = `${maxDate.getFullYear()}-${(maxDate.getMonth() + 1)
          .toString()
          .padStart(2, '0')}-${maxDate.getDate().toString().padStart(2, '0')}`;
        
        return formattedMaxDate;  
    }
    
    const getMinTime = () => {
      const now = new Date();


      // Format the time to 'HH:MM' format
      const formattedMinTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      return formattedMinTime;
    }

    const handleJobTypeChange = (event) => {
        setJobType(event.target.value);
    };

    const handleDateChange = (event) => {
        setDate(event.target.value);
    };

    const handleTimeChange = (event) => {
      if (date !== '') {
        const selectedTime = event.target.value;
      
        // Check if the selected date is today
        const selectedDate = new Date(date);
        const today = new Date();
        const isToday = selectedDate.toDateString() === today.toDateString();

        const minTime = getMinTime();
      
        // Check if the selected time is before the minimum time
        if (isToday && selectedTime < minTime) {
          // If the selected time is before the minimum time and it's today, set it to the minimum time
          setTime(minTime);
        } else {
          // If the selected time is valid, update the state with the selected time
          setTime(selectedTime);
        }  
      }
    }


      const handleSubmit = (event) => {
        event.preventDefault();

        getWeatherForecast().then((forecast) => {
          // Send a request to post the advertisement to the backend
        fetch(`${baseUrl}/advertisement`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: userDetails.email,
            date: date,
            time: time,
            job_type: jobType,
            status: "Active",
            latitude: location[0],
            longitude: location[1],
            forecast: forecast,
          }),
        })
          .then(response => response.json())
          .then(data => {
            console.log('Advertisement posted successfully:', data);
            handleViewRequestForm();
            return data;
          })
          .catch(error => {
            console.error('Error posting advertisement:', error);
          });    
        });
      };

    return (
        <div>
            <Typography variant="h2" color="blue-gray" className="mb-2">
                Request a Job
            </Typography>
            <form onSubmit={handleSubmit}>
                <div className="my-4">
                <select
                    value={jobType}
                    onChange={handleJobTypeChange}
                    className="block w-full px-4 py-2 mt-2 bg-white border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                    <option value="">Select type of work</option>
                    <option value="cleaner">House Cleaner</option>
                    <option value="plumber">Plumber</option>
                    <option value="electrician">Electrician</option>
                    <option value="gardener">Gardener</option>
                    <option value="painter">Painter</option>
                </select>
                </div>
                <div className="my-4">
                    <Input
                        type="date"
                        placeholder="Select date"
                        value={date}
                        onChange={handleDateChange}
                        min={getCurrentDate()}
                        max={getMaxDate()}
                    />
                </div>
                <div className="my-4">
                    <Input
                        type="time"
                        placeholder="Select time"
                        value={time}
                        onChange={handleTimeChange}
                        min={getMinTime()}
                    />
                </div>
                <Button type="submit" color="blue">
                    Submit Request
                </Button>
            </form>
        </div>
    );
};

const CustomerDashboard = ({ userDetails }) => {
  const [advertisements, setAdvertisements] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  

  const fetchWorkerDetailsById = async (workerId) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/worker/${workerId}`);
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error('Error fetching advertisements:', error);
    }
  };

  const handleWorkerNameClick = (workerId) => {
    // Fetch worker details based on workerId
    // For simplicity, let's assume you have a function fetchWorkerDetailsById that fetches worker details by id
    fetchWorkerDetailsById(workerId).then((workerDetails) => {
      setSelectedWorker(workerDetails);
      setShowPopup(true);
    });
  };

  const [previousAdvertisements, setPreviousAdvertisements] = useState([]);

  const isEqual = (arr1, arr2) => JSON.stringify(arr1) === JSON.stringify(arr2);

  const fetchAdvertisements = async () => {
    try {
      const encodedEmail = encodeURIComponent(userDetails.email);
      const response = await fetch(`${config.API_BASE_URL}/advertisement/customer/${encodedEmail}`);
      const data = await response.json();
      const newAdvertisements = JSON.parse(data).advertisements;

      if (!isEqual(newAdvertisements, previousAdvertisements)) {
        setAdvertisements(newAdvertisements);
        setPreviousAdvertisements(newAdvertisements);
      }
    } catch (error) {
      console.error('Error fetching advertisements:', error);
    }
  };

  useEffect(() => {
    // Fetch advertisements initially
    fetchAdvertisements();

    // Poll for updates every 10 seconds (adjust as needed)
    const intervalId = setInterval(fetchAdvertisements, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleDeleteAdvertisement = async (advertisementId) => {
    try {
      await fetch(`${config.API_BASE_URL}/advertisement/${advertisementId}`, {
        method: 'DELETE'
      }).then(() => fetchAdvertisements());
    } catch (error) {
      console.error('Error deleting advertisement:', error);
    }
  };

  return (
    <div>
      <div>
        <Typography variant="h3" color="blue-gray" className="mb-2">
          Active Advertisements:
        </Typography>
  
        {advertisements.length === 0 ? (
          <Typography variant="paragraph" color="blue-gray">
            No active advertisements to display.
          </Typography>
        ) : (
          <ul>
            {advertisements
              .filter((advertisement) => advertisement.status === "Active")
              .map((advertisement, index) => (
                <Card key={index} color="gray" className="mb-4" style={{ marginTop: "20px" }}>
                  <CardBody>
                    <div className="flex justify-between mb-2">
                      <span>Job Type: {advertisement.job_type}</span>
                      <span>Date: {advertisement.date}</span>
                      <span>Time: {advertisement.time}</span>
                      <Button color="red" onClick={() => handleDeleteAdvertisement(advertisement._id)}>
                        Delete
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              ))}
          </ul>
        )}
      </div>
  
      <div>
        <Typography variant="h3" color="blue-gray" className="mb-2">
          Accepted Advertisements:
        </Typography>
  
        {advertisements.length === 0 ? (
          <Typography variant="paragraph" color="blue-gray">
            No accepted advertisements to display.
          </Typography>
        ) : (
          <ul>
            {advertisements
              .filter((advertisement) => advertisement.status === "Accepted")
              .map((advertisement, index) => (
                <Card key={index} color="gray" className="mb-4" style={{ marginTop: '20px' }}>
              <CardBody>
                <div className="flex justify-between mb-2">
                  <span>
                    Worker Name:
                    <button
                      onClick={() => handleWorkerNameClick(advertisement.worker_id)}
                      style={{
                        background: '#3498db',
                        color: '#fff',
                        border: 'none',
                        padding: '8px 16px',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        transition: 'background 0.3s',
                        display: 'flex',
                        alignItems: 'center',
                      }}
                    >
                      {advertisement.worker_name}
                    </button>
                  </span>
                  <span>Job Type: {advertisement.job_type}</span>
                  <span>Date: {advertisement.date}</span>
                  <span>Time: {advertisement.time}</span>
                  <Button
                    color="red"
                    onClick={() => handleDeleteAdvertisement(advertisement._id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardBody>
            </Card>
              ))}
          </ul>
        )}
      </div>
      {/* Render WorkerDetailsPopup */}
      {showPopup && selectedWorker && (
        <WorkerDetailsPopup workerDetails={selectedWorker} onClose={() => setShowPopup(false)} />
      )}
    </div>
  );
};

const WorkerDetailsPopup = ({ workerDetails, onClose }) => {
  const popupStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  };

  const popupContentStyle = {
    backgroundImage: `url(${popup})`,
    backgroundSize: '100% 100%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.5)',
    maxWidth: '400px',
    width: '100%',
    position: 'relative',
    color: '#000',  // Adjust text color based on your image
  };

  const closeStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    fontSize: '24px',
    cursor: 'pointer',
  };

  const workerInfoStyle = {
    marginBottom: '10px',
  };

  const generateStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} style={{ marginRight: '5px', display: 'inline-block', color: i <= rating ? 'gold' : 'transparent' }}>
          {i <= rating ? <FaStar /> : <FaRegStar />}
        </span>
      );
    }
    return stars;
  };

  return (
    <div style={popupStyle}>
      <div style={popupContentStyle}>
        <span style={closeStyle} onClick={onClose}>&times;</span>
        <div style={workerInfoStyle}>
          <div style={{ fontWeight: 'bold' }}>Worker Name:</div>
          {workerDetails.username}
        </div>
        <div style={workerInfoStyle}>
          <div style={{ fontWeight: 'bold' }}>Worker Email:</div>
          {workerDetails.email}
        </div>
        <div style={workerInfoStyle}>
          <div style={{ fontWeight: 'bold' }}>Job Types:</div>
          {workerDetails.job_types.join(', ')}
        </div>
        <div style={workerInfoStyle}>
          <div style={{ fontWeight: 'bold' }}>Rating:</div>
          {generateStars(4)}
        </div>
      </div>
    </div>
  );
};



const CustomerProfilePage = ({ userDetails }) => {
  // State to manage which view to display
  const [showForm, setShowForm] = useState(false);

  // Handler to switch views
  const toggleView = () => {
    setShowForm((prevShowForm) => !prevShowForm);
  };

  return (
    <div className="container mx-auto p-4">
      <hr className="my-6" />

      <Button color="blue" onClick={toggleView} style={{ marginLeft: '85%' }}>
        {showForm ? 'Show Dashboard' : 'Request Another Job'}
      </Button> 

      {showForm ? ( // Display the job request form if showForm is true
        
          <CustomerJobRequestForm userDetails={userDetails} toggleView={toggleView} />
    
      ) : (
        // Display the success page if showForm is false
        <CustomerDashboard userDetails={userDetails} />
      )}
    </div>
  );
};

export default CustomerProfilePage;
