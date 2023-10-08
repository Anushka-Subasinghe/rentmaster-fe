import React, {useEffect, useState} from 'react';
import { Typography, Input, Button, Card, CardBody } from '@material-tailwind/react';
import config from "@/config";

const CustomerJobRequestForm = ({ userDetails, toggleView }) => {
    const [jobType, setJobType] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

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

    const handleJobTypeChange = (event) => {
        setJobType(event.target.value);
    };

    const handleDateChange = (event) => {
        setDate(event.target.value);
    };

    const handleTimeChange = (event) => {
        setTime(event.target.value);
    };



      const handleSubmit = (event) => {
        event.preventDefault();

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
            status: "Active"
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
                    />
                </div>
                <div className="my-4">
                    <Input
                        type="time"
                        placeholder="Select time"
                        value={time}
                        onChange={handleTimeChange}
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

  const fetchAdvertisements = async () => {
    try {
      const encodedEmail = encodeURIComponent(userDetails.email);
      const response = await fetch(`${config.API_BASE_URL}/advertisement/customer/${encodedEmail}`);
      const data = await response.json();
      console.log(data);
      setAdvertisements(JSON.parse(data).advertisements);
    } catch (error) {
      console.error('Error fetching advertisements:', error);
    }
  };  

  useEffect(() => {
    fetchAdvertisements();
  }, [userDetails.email]);

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
          Your Advertisements:
        </Typography>

        {advertisements.length === 0 ? (
          <Typography variant="paragraph" color="blue-gray">
            No advertisements to display.
          </Typography>
        ) : (
          <ul>
            {advertisements.map((advertisement, index) => (
                <Card key={index} color="gray" className="mb-4" style={{marginTop: "20px"}}>
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
