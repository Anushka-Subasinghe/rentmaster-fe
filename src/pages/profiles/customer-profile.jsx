import React, {useEffect, useState} from 'react';
import { Typography, Input, Button, Card, CardBody, CardHeader, Menu,
  MenuHandler,
  MenuList,
  MenuItem } from '@material-tailwind/react';
import config from "@/config";
import moment from 'moment-timezone';
import { FaStar, FaRegStar } from 'react-icons/fa';
import placeHolder from "../../assets/profilePlaceHolder.jfif";
import { toast, ToastContainer } from 'react-toastify';
import Modal from 'react-modal';
import { Widget, addResponseMessage, dropMessages, setQuickButtons, toggleWidget, toggleInputDisabled, addUserMessage } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import './chatWidget.css'
import chatIcon from "../../assets/chatIcon.png"
const chatBotUrl = config.CHATBOT_URL;

const getCurrentTimeRoundedToNearestHour = () => {
  const now = new Date();
  const minutes = now.getMinutes();
  const roundedMinutes = Math.round(minutes / 60) * 60; // Round to the nearest hour
  now.setMinutes(roundedMinutes);
  const formattedTime = now.toTimeString().slice(0, 5); // Get time in HH:mm format
  return formattedTime;
};

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

const CustomerJobRequestForm = ({ userDetails, toggleView, showForm }) => {
    const [jobType, setJobType] = useState(null);
    const [date, setDate] = useState('');
    const [time, setTime] = useState(getCurrentTimeRoundedToNearestHour());
    const [location, setLocation] = useState([0, 0]);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [buttonType, setButtonType] = useState('');
    const [buttons, setButtons] = useState([{label: 'Yes', value: 'Yes', buttonClassName: 'custom-quick-button'}, {label: 'No', value: 'No', buttonClassName: 'custom-quick-button'}]);


    const handleToggleChat = () => {
      toggleWidget();
      setIsChatOpen(!isChatOpen);
    };

    useEffect(() => {
      dropMessages();
      addResponseMessage('Hi. Do you need to request a job?');
      toggleInputDisabled();
    }, [showForm])

    useEffect(() => {
      // deleteMessages(1);
      // addResponseMessage('Hi. Do you need to request a job?');
      toggleWidget();
      setQuickButtons(buttons);
    },[isChatOpen]);

    useEffect(() => {
      setQuickButtons(buttons);  
    },[buttons]);

    const handleNewUserMessage = (newMessage) => {
      console.log(`New message incoming! ${newMessage}`);
      // Now send the message through the backend API
    };

    const handleQuickButtonClicked = async (newMessage) => {
      console.log(`QuickButtonCLicked! ${newMessage}`);
      addUserMessage(newMessage);
      if (buttonType == 'jobType') {
        setJobType(newMessage);
      }
      if (buttonType == 'date') {
        setDate(newMessage);
      }
      // Now send the message through the backend API
      try {
        const response = await fetch(chatBotUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ "message": newMessage }),
        });

        if (response.ok) {
          const message = await response.json();
          addResponseMessage(message[0].text);
          if (message[0].buttons) {
            console.log(message[0].buttons);
            const newButtons = message[0].buttons.map((button) => {
              return {label: button.title, value: button.title, buttonClassName: 'custom-quick-button', type: button.payload}});
            setQuickButtons(newButtons);
            setButtons(newButtons);
            setButtonType(message[0].buttons[0].payload);
          }
          handleToggleChat();
          if (message[0].text == "Job confirmed") {
            setIsChatOpen(false);
            handleSubmit(null);
          } else if (message[0].text == "Job cancelled") {
            setIsChatOpen(false);  
          }
        } else {
          // Handle error response (e.g., incorrect credentials)
          const errorResponse = await response.text();
          console.log(errorResponse);
          toast.error(errorResponse.detail);
        }
      } catch (error) {
        toast.error("An error occurred while logging in. Please try again later.");
        console.log("Error logging in:", error);
      }
    };

    const closeChat = () => {
      setIsChatOpen(false);
    }

    const getLauncher = () => (
      <div
        style={{
          position: 'fixed',
          bottom: '15px',
          right: '15px',
          zIndex: '999',
          width: '60px', // Set the desired width
          height: '60px', // Set the desired height
          borderRadius: '50%', // Make it round
          overflow: 'hidden', // Hide overflowing content
        }}
      >
        <img
          src={chatIcon}
          onClick={!isChatOpen ? handleToggleChat : closeChat}
          style={{
            width: '100%', // Make the image fully cover the button
            height: '100%', // Make the image fully cover the button
          }}
        />
      </div>
    );
    
    const getWeatherForecast = async () => {
  
      const timeZone = 'Asia/Kolkata';
  
      // Combine the date and time and format it
      const combinedDateTime = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm').tz(timeZone);
    
      // Convert the combined date and time to a Unix timestamp (in seconds)
      const timestamp = combinedDateTime.unix();
      console.log(timestamp)
  
      const apiKey = "38bde97caffcf4daa9adbfedb5fee58f";
      const apiUrl = `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${location[0]}&lon=${location[1]}&dt=${timestamp}&appid=${apiKey}`;
      
      try {
        const response = await fetch(apiUrl);
        if (response.ok) {
          const data = await response.json();
          // Assuming the jobDate is in YYYY-MM-DD format
          const jobForecast = {weather: data.data[0].weather[0].description, temperature: parseFloat((data.data[0].temp - 273.15).toFixed(1)), humidity: data.data[0].humidity, windspeed: parseFloat(data.data[0].wind_speed.toFixed(1))};
          console.log(data);
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
      const selectedDate = new Date(date);
      const isToday = selectedDate.toDateString() === now.toDateString();
      // Format the time to 'HH:MM' format
      const formattedMinTime = isToday ? `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}` : '';
      return formattedMinTime;
    }

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

    const JobTypeSelectionDropDown = () => 
      <Menu placement="bottom-start">
        <MenuHandler>
          <Button
            ripple={false}
            variant="text"
            className="flex h-10 items-center bg-none"
            style={{fontSize: '16px'}}
          >
            {jobType == null ? 'Select Work Type' : jobType}
          </Button>
        </MenuHandler>
        <MenuList className="max-h-[20rem] max-w-[18rem]">
          {['cleaner', 'plumber', 'electrician', 'gardener', 'painter'].map(( name, index) => {
            return (
              <MenuItem
                key={index}
                value={name}
                className="flex items-center gap-2"
                onClick={(e) => setJobType(name)}
              >
                {name}
              </MenuItem>
            );
          })}
        </MenuList>
      </Menu>;


      const handleSubmit = (event) => {
        if (event !== null) {
          event.preventDefault();  
        }

        // Check if all required fields are selected
        if (jobType.length == 0 || date.length == 0 || time.length == 0) {
          console.log('Please select all required fields.');
          toast.error('Please select all required fields.');
          return;
        }

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
            work_type: jobType == 'cleaner' || jobType == 'electrician' || jobType == 'plumber' ? true : false,
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
            <Typography variant="h2" color="white" className="mb-2">
                Request a Job
            </Typography>
            <form onSubmit={handleSubmit}>
                <div className="my-4">
                  <JobTypeSelectionDropDown />
                </div>
                <div className="my-4">
                    <Input
                        className='bg-white border border-gray-300 rounded-md'
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
                        className='bg-white border border-gray-300 rounded-md'
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
            <Widget
              handleNewUserMessage={handleNewUserMessage}
              handleQuickButtonClicked={handleQuickButtonClicked}  
              launcher={getLauncher}
              showEmoji={false}
              loading={false}
            />    
          </div>
    );
};

const CustomerDashboard = ({ userDetails }) => {
  const [advertisements, setAdvertisements] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [selectedAdvertisement, setSelectedAdvertisement] = useState(null);
  const [selectedBidsAdvertisement, setSelectedBidsAdvertisement] = useState(null);
  const [selectedWorkersAdvertisement, setSelectedWorkersAdvertisement] = useState(null);

  // Function to handle opening the modal with bids for the selected advertisement
  const openBidsModal = (advertisement) => {
    setSelectedBidsAdvertisement(advertisement);
  };

  // Function to close the modal
  const closeBidsModal = () => {
    setSelectedBidsAdvertisement(null);
  };

  // Function to handle opening the modal with bids for the selected advertisement
  const openWorkersModal = async (advertisement) => {
    await fetchWorkersByJobType(advertisement.job_type).then(() => {
      setSelectedAdvertisement(advertisement)
    });
  };

  // Function to close the modal
  const closeWorkersModal = () => {
    setSelectedWorkersAdvertisement(null);
    setSelectedAdvertisement(null);
  };
  
  

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

  const fetchWorkersByJobType = async (jobType) => {
    try {
      // const encodedEmail = encodeURIComponent(userDetails.job_type);
      const response = await fetch(`${config.API_BASE_URL}/user/jobType/${jobType}`);
      const workers = await response.json();
      console.log(workers);
      setSelectedWorkersAdvertisement(workers)
    } catch (error) {
      console.error('Error fetching workers:', error);
    }  
  };

  useEffect(() => {
    // Fetch advertisements initially
    fetchAdvertisements();

    // Poll for updates every 5 seconds (adjust as needed)
    const intervalId = setInterval(fetchAdvertisements, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);

  }, []);

  useEffect(() => setSelectedBidsAdvertisement(selectedBidsAdvertisement !== null ? advertisements.find((advertisement) => advertisement._id == selectedBidsAdvertisement._id)  : null), [advertisements]);
  //useEffect(() => setSelectedWorkersAdvertisement(selectedWorkersAdvertisement !== null ? advertisements.find((advertisement) => advertisement._id == selectedWorkersAdvertisement._id)  : null), [advertisements]);

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
        <Typography variant="h3" color="white" className="mb-2">
          Active Advertisements:
        </Typography>
  
        {advertisements.filter((advertisement) => advertisement.status === "Active").length === 0 ? (
          <Typography variant="h4" color="white" className="mb-2">
            No active advertisements to display.
          </Typography>
        ) : (
          <ul>
            {advertisements
              .filter((advertisement) => advertisement.status === "Active")
              .map((advertisement, index) => (
                <Card key={index} className="mt-6 flex flex-row justify-between" style={{ marginTop: "20px", width: '1000px' }}>
                  <CardBody className="flex flex-row">
                    <div className="flex">
                      <Typography variant="h6" color="blue">
                        Job Type:&nbsp;&nbsp;
                      </Typography>
                      <Typography className="mr-6">
                        {advertisement.job_type}
                      </Typography>
                      <Typography variant="h6" color="blue">
                        Date:&nbsp;&nbsp;
                      </Typography>
                      <Typography className="mr-6">
                        {advertisement.date}
                      </Typography>
                      <Typography variant="h6" color="blue">
                        Time:&nbsp;&nbsp;
                      </Typography>
                      <Typography className="mr-6">
                        {advertisement.time}
                      </Typography>
                    </div>
                  </CardBody>
                  <div className="flex items-center mr-4">
                  <Button className='mr-5' color="blue" onClick={() => openWorkersModal(advertisement)}>
                    Workers
                  </Button>  
                  <Button disabled={advertisement.bid.length == 0} className='mr-5' color="blue" onClick={() => openBidsModal(advertisement)}>
                    View Bids
                  </Button>
                    <Button color="red" onClick={() => handleDeleteAdvertisement(advertisement._id)}>
                      Delete
                    </Button>
                  </div>
                </Card>
              ))}
          </ul>
        )}
      </div>
  
      <div style={{ marginTop: "100px" }}>
        <Typography variant="h3" color="white" className="mb-2">
          Accepted Advertisements:
        </Typography>
  
        {advertisements.filter((advertisement) => advertisement.status === "Accepted").length === 0 ? (
          <Typography variant="h4" color="white" className="mb-2">
            No accepted advertisements to display.
          </Typography>
        ) : (
          <ul>
            {advertisements
              .filter((advertisement) => advertisement.status === "Accepted")
              .map((advertisement, index) => (
            <Card key={index} className="mt-6 flex flex-row justify-between" style={{ marginTop: "20px", width: '1000px' }}>
              <CardBody className="flex flex-row">
                <div className="flex">
                <div className="flex items-center mr-4">
                <Typography variant="h6" color="blue">
                    Worker:&nbsp;&nbsp;
                  </Typography>
                <Button           style={{
                                    background: '#3498db',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    transition: 'background 0.3s',
                                    display: 'flex',
                                    alignItems: 'center',
                                  }} onClick={() => handleWorkerNameClick(advertisement.worker_id)}>
                {advertisement.worker_name}
                </Button>
              </div>
                  <Typography variant="h6" color="blue">
                    Job Type:&nbsp;&nbsp;
                  </Typography>
                  <Typography className="mr-6">
                    {advertisement.job_type}
                  </Typography>
                  <Typography variant="h6" color="blue">
                    Date:&nbsp;&nbsp;
                  </Typography>
                  <Typography className="mr-6">
                    {advertisement.date}
                  </Typography>
                  <Typography variant="h6" color="blue">
                    Time:&nbsp;&nbsp;
                  </Typography>
                  <Typography className="mr-6">
                    {advertisement.time}
                  </Typography>
                  <Typography variant="h6" color="blue">
                    Price:&nbsp;&nbsp;
                  </Typography>
                  <Typography className="mr-6">
                    {advertisement.price}/=
                  </Typography>
                </div>
              </CardBody>
              <div className="flex items-center mr-4">
                <Button color="red" onClick={() => handleDeleteAdvertisement(advertisement._id)}>
                  Delete
                </Button>
              </div>
            </Card>
              ))}
          </ul>
        )}
      </div>
      {/* Render WorkerDetailsPopup */}
      {showPopup && selectedWorker && (
        <ProfileCard workerDetails={selectedWorker} onClose={() => setShowPopup(false)} />
      )}
      {/* Modal to display bids for the selected advertisement */}
      <Modal
        isOpen={selectedBidsAdvertisement !== null}
        onRequestClose={closeBidsModal}
        contentLabel="Bids Modal"
        style={{
        content: {
          width: '1100px', // Adjust the width to match your bid card width
          margin: 'auto', // Center the modal horizontally
        },
        overlay: {
          background: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        }
  }}
>
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h3" color="black" className="mb-2">
        Bids for Advertisement
      </Typography>
      <span style={{
        position: 'absolute',
        top: '0px',
        right: '20px',
        fontSize: '36px',
        color: '#E13E3E',
        cursor: 'pointer',
      }} onClick={closeBidsModal}>&times;</span>
    </div>
    <div style={{ maxHeight: '400px', overflowY: 'auto' }}> {/* Adjust maxHeight and overflowY as needed */}
      {selectedBidsAdvertisement && (
        <ul>
          {selectedBidsAdvertisement.bid.slice().sort((a, b) => a.price - b.price).map((bid, bidIndex) => (
            <li key={bidIndex}>
              <BidCard
                job={selectedBidsAdvertisement}
                bid={bid}
                userDetails={userDetails}
                openBidsModal={openBidsModal}
                closeBidsModal={closeBidsModal}
                setworkers={setSelectedWorkersAdvertisement}
                setAdd={setSelectedAdvertisement}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
</Modal>
    {/* Modal to display available workers for the selected advertisement */}
    <Modal
        key={selectedAdvertisement}
        isOpen={selectedWorkersAdvertisement !== null}
        onRequestClose={closeBidsModal}
        contentLabel="Bids Modal"
        style={{
        content: {
          width: '1100px', // Adjust the width to match your bid card width
          margin: 'auto', // Center the modal horizontally
        },
        overlay: {
          background: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        }
  }}
>
  <div>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Typography variant="h3" color="black" className="mb-2">
        Available Workers for Advertisement
      </Typography>
      <span style={{
        position: 'absolute',
        top: '0px',
        right: '20px',
        fontSize: '36px',
        color: '#E13E3E',
        cursor: 'pointer',
      }} onClick={closeWorkersModal}>&times;</span>
    </div>
    <div style={{ maxHeight: '400px', overflowY: 'auto' }}> {/* Adjust maxHeight and overflowY as needed */}
      {selectedWorkersAdvertisement && (
        <ul>
          {selectedWorkersAdvertisement.map((worker, workerIndex) => (
            <li key={workerIndex}>
              <WorkerCard
                worker={worker}
                closeWorkerModal={closeWorkersModal}
                advertisement={selectedAdvertisement}
                setAdd={setSelectedAdvertisement}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  </div>
</Modal>        
    </div>
  );
};

const selectWorker = async (advertisement, worker, closeWorkerModal, setAdd) => {
  try {
    await fetch(`${config.API_BASE_URL}/advertisement/selectWorker`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: advertisement._id,
        worker_id: worker._id,
        name: worker.username,
        email: worker.email,
        job_types: worker.job_types 
      }),
    }).then(async (res) => {
      const data = await res.json();
      console.log(data);
      setAdd(data);
      //closeWorkerModal();  
    });
  } catch (error) {
    console.error('Error fetching advertisements:', error);
  }
};

const cancelWorker = async (advertisement, worker, closeWorkerModal, setAdd) => {
  try {
    await fetch(`${config.API_BASE_URL}/advertisement/cancelWorker`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: advertisement._id,
        worker_id: worker._id, 
      }),
    }).then(async (res) => {
      const data = await res.json();
      console.log(data);
      setAdd(data);
      //closeWorkerModal();  
    });
  } catch (error) {
    console.error('Error fetching advertisements:', error);
  }
};

const WorkerCard = ({ worker, closeWorkerModal, advertisement, setAdd }) => {
  return (
    <Card style={{ width: '1000px', border: '1px solid gray', borderRadius: '10px', marginBottom: '20px' }}>
      <CardBody>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}> 
          <Typography className="mr-10" variant="h4" color="blue">
            Worker: {worker.username}
          </Typography>
          <Typography className="mr-5" variant="h4" color="blue">
            Email: {worker.email}
          </Typography>
        </div>
        <div>
          <Button className="mr-5" color={!advertisement.selectedWorkers.some((w) => w.worker_id == worker._id) ? "green" : "red"} onClick={() => {
            if(!advertisement.selectedWorkers.some((w) => w.worker_id == worker._id)) {
              selectWorker(advertisement, worker, closeWorkerModal, setAdd)
            } else {
              cancelWorker(advertisement, worker, closeWorkerModal, setAdd)
            }            
            }}
            >
            {!advertisement.selectedWorkers.some((w) => w.worker_id == worker._id) ? "Select" : "Unselect"}
          </Button>
        </div>
      </div>  
      </CardBody>
    </Card>
  );  
}

const BidCard = ({ job, bid, userDetails, openBidsModal, closeBidsModal, setworkers, setAdd }) => {
  const { worker_name, price, worker_id } = bid;

  const cancelBid = async (job) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/advertisement/cancelBid`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: job._id,
          worker_id: worker_id,
        }),
      });
      const data = await response.json(); 
      openBidsModal(data);
    } catch(error) {
      console.error("Error cancelling bid:", error);  
    } 
  }

  const acceptBid = async (job) => {
    try {
      // Send a request to update the job status to "Accepted"
      const response = await fetch(`${config.API_BASE_URL}/advertisement/accept`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: job._id,
          worker_name: worker_name,
          worker_id: worker_id,
          price: price,
        }),
      }).then(() => {
        closeBidsModal(); 
        setAdd(null);
        setworkers(null); 
      }); 
    } catch (error) {
      console.error('Error accepting job:', error);
    }
  }

  return (
    <Card style={{ width: '1000px', border: '1px solid gray', borderRadius: '10px', marginBottom: '20px' }}>
      <CardBody>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}> 
          <Typography className="mr-10" variant="h4" color="blue">
            Worker: {worker_name}
          </Typography>
          <Typography className="mr-5" variant="h4" color="blue">
            Price: {price}
          </Typography>
        </div>
        <div>
          <Button className="mr-5" color="green" onClick={() => acceptBid(job, price)}>
            Accept Bid
          </Button>
          <Button color="red" onClick={() => cancelBid(job, userDetails)}>
            Cancel Bid
          </Button>
        </div>
      </div>  
      </CardBody>
    </Card>
  );
};

const ProfileCard = ({ workerDetails, onClose }) => {
  const closeStyle = {
    position: 'absolute',
    top: '5px',
    right: '10px',
    fontSize: '36px',
    color: '#E13E3E',
    cursor: 'pointer',
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

  const profilePictureSrc = workerDetails.profile_picture
  ? `data:image/png;base64, ${workerDetails.profile_picture}`
  : placeHolder;

  return (
    <div className="flex justify-center items-center h-screen">
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-75">
          <Card className="w-96">
            <CardHeader floated={false} className="h-80" style={{ position: 'relative' }}>
              <img
              id="profilePicture"
              alt="Profile Picture"
              src={profilePictureSrc}
              className="shadow-xl h-full w-full object-cover"
            />
            </CardHeader>
            <CardBody className="text-center">
              <span style={closeStyle} onClick={onClose}>&times;</span>
              <Typography variant="h4" color="blue-gray" className="mb-2">
                {workerDetails.username}
              </Typography>
              <Typography color="blue-gray" className="font-medium" textGradient>
                {workerDetails.email}
              </Typography>
              <Typography color="blue-gray" className="font-medium" textGradient>
                Job Types:&nbsp;{workerDetails.job_types.join(', ')}
              </Typography>
              <Typography color="blue-gray" className="font-medium" textGradient>
                Rating:&nbsp;{generateStars(4)}
              </Typography>
            </CardBody>
          </Card>
        </div>
    </div>
  );
}

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
      <ToastContainer position="top-center" autoClose={1000} hideProgressBar />
    </div>
  );
};

export default CustomerProfilePage;
