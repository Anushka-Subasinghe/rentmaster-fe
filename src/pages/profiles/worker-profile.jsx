import React, { useState, useEffect } from "react";
import {
  Card,
  CardBody,
  Typography,
  Button,
  Input,
} from "@material-tailwind/react";
import config from "@/config";
import badWeather from '../../assets/badWeather.jpg';

const JobCard = ({job, handleJob, cancelJob, finishJob, userDetails}) => {
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const handleAcceptJob = (job) => {
    setSelectedJob(job);
    setIsPopupVisible(true);
  };

  const handlePriceSubmit = (price) => {
    // Handle price submission and job acceptance
    // Call the handleJob function with the selected job and price
    handleJob(selectedJob, true, price);
    setIsPopupVisible(false);
  };

  const cancelBid = async (job, userDetails) => {
    try {
      const response = await fetch(`${config.API_BASE_URL}/advertisement/cancelBid`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: job._id,
          worker_id: userDetails.id,
        }),
      }); 
    } catch(error) {
      console.error("Error cancelling bid:", error);  
    } 
  }

  const handleCancel = () => {
    setIsPopupVisible(false);
  };

  const hasBid = (job, userDetails) => job.bid.some(bid => bid.worker_id === userDetails.id);


  return (
    <>
    <Card className="mt-6 flex flex-row">
      <CardBody className="ml-1 flex flex-row justify-between">
        <Typography variant="h6" color="blue">
          Job Type:&nbsp;&nbsp;
        </Typography>
        <Typography className="mr-6">
          {job.job_type}
        </Typography>
        <Typography variant="h6" color="blue">
          Date:&nbsp;&nbsp;
        </Typography>
        <Typography className="mr-6">
          {job.date}
        </Typography>
        <Typography variant="h6" color="blue">
          Time:&nbsp;&nbsp;
        </Typography>
        <Typography className="mr-6">
          {job.time}
        </Typography>
        <Typography variant="h6" color="blue">
          Customer:&nbsp;&nbsp;
        </Typography>
        <Typography className="mr-6">
          {job.customer_name}
        </Typography>
        <Typography variant="h6" color="blue">
          Weather Forecast:&nbsp;&nbsp;
        </Typography>
        <Typography className="mr-6">
          {job.forecast.weather}
        </Typography>
        <Typography variant="h6" color="blue">
          Distance:&nbsp;&nbsp;
        </Typography>
        <Typography className="mr-6">
          {parseFloat(job.distance.toFixed(2))}km
        </Typography>
        {job.status === 'Active' ? (
        <Button color={!hasBid(job, userDetails) ? "blue" : "green"} onClick={!hasBid(job, userDetails) ? () => handleAcceptJob(job) : () => cancelBid(job, userDetails)}>
          {hasBid(job, userDetails) ? 'Cancel Bid' : 'Submit Bid'}
        </Button>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Button className="mr-5" color="red" onClick={() => cancelJob(job)}>
            Cancel Job
          </Button>
          <Button color="blue" onClick={() => finishJob(job)}>
            Finish Job
          </Button>  
        </div>
      )}
      </CardBody>
    </Card>
    {isPopupVisible && (
        <PriceCard onPriceSubmit={handlePriceSubmit} onCancel={handleCancel} prediction={job.prediction} type ={job.job_type} />
      )}
    </>
  );
}

const PriceCard = ({ onPriceSubmit, onCancel, prediction, type }) => {
  const [price, setPrice] = useState(0);
  const [percentage, setPercentage] = useState(0);

  useEffect(() => {
    if(!prediction) {
      setPercentage(parseFloat(weatherPercentages[type]));
    }
  },[])

  const weatherPercentages = {
    'painter': 20,
    'cleaner': 10,
    'electrician': 15,
    'gardener': 25,
    'plumber': 10 
  };

  const handlePriceChange = (event) => {
    setPrice(parseFloat(event.target.value));
  };

  const handleSubmit = () => {
    onPriceSubmit(price + (price * percentage / 100));
  };

  const closeStyle = {
    position: 'absolute',
    top: '0px',
    right: '10px',
    fontSize: '36px',
    color: '#E13E3E',
    cursor: 'pointer',
  };

  return (
    <div className="flex justify-center items-center h-screen">
        <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-75">
          <Card className="w-96 justify-center items-center">
            <CardBody className="text-center">
              <span style={closeStyle} onClick={onCancel}>&times;</span>
              {!prediction ? <div className="w-72 mt-4">
                <img src={badWeather} alt="Warning" />
                <Typography variant="h4" color="red" className="mb-2">
                  The conditions are not suitable for this job.
                </Typography>
                <Typography variant="h4" color="blue" className="mb-2">
                You will get an extra {percentage}% added to your price.
                </Typography>
              </div> : <div />}
              <div className="w-72 mt-4">
                <Input label="Enter Price" onChange={handlePriceChange} />
              </div>
              <div className="w-72 mt-4">
              <Button variant="gradient" onClick={handleSubmit}>Submit Price</Button>
              </div>
            </CardBody>
          </Card>
        </div>
    </div>
  );
}

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

function WorkerProfilePage({ userDetails }) {
  const [jobs, setJobs] = useState([]);
  const [workerLocation, setWorkerLocation] = useState({latitude: 0, longitude: 0});

    useEffect(() => {
        getCurrentLocation()
  .then(location => {
    setWorkerLocation({latitude: location.latitude, longitude: location.longitude});
  })
  .catch(error => {
    console.error('Error getting location:', error);
  });
      }, []);

  const workerJobTypes = userDetails.job_types || [];

  function isEqual(arr1, arr2) {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  }  

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const earthRadiusKm = 6371;  // Radius of the Earth in kilometers
    const dLat = degreesToRadians(lat2 - lat1);
    const dLon = degreesToRadians(lon2 - lon1);
  
    lat1 = degreesToRadians(lat1);
    lat2 = degreesToRadians(lat2);
  
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
    return earthRadiusKm * c;
  };
  
  const degreesToRadians = (degrees) => {
    return degrees * (Math.PI / 180);
  };

  const calculateProximity = (jobLocation) => {
    // Simple Euclidean distance formula for proximity using latitude and longitude
    const dx = workerLocation.latitude - jobLocation.latitude;
    const dy = workerLocation.longitude - jobLocation.longitude;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const fetchJobs = async () => {
    try {
      // Get worker's job types
      const queryString = workerJobTypes.map((jobType, index) => {
          // If it's the last job type, don't append '&'
          return index === workerJobTypes.length - 1 ? `job_types=${jobType}` : `job_types=${jobType}&`;
        }).join('');
        
        const url = `${config.API_BASE_URL}/advertisement/jobType?${queryString}`;

      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        const adds = JSON.parse(data).advertisements;
        // Calculate proximity and sort jobs by proximity
        const jobsWithProximity = adds.map(job => {
          const distance = workerLocation.latitude == 0 ? 0 : calculateDistance(
            workerLocation.latitude,
            workerLocation.longitude,
            job.latitude,
            job.longitude,
          );
          return ({
          ...job,
          proximity: calculateProximity({ latitude: job.latitude, longitude: job.longitude }),
          distance: distance,
        })});
        jobsWithProximity.sort((a, b) => a.proximity - b.proximity);

        setJobs(jobsWithProximity);
      } else {
        console.error("Failed to fetch ads");
      }
    } catch (error) {
      console.error("Error fetching ads:", error);
    }
  };  

  useEffect(() => {
    // Fetch jobs initially
    fetchJobs();

    // Poll for updates every 10 seconds (adjust as needed)
    const intervalId = setInterval(fetchJobs, 5000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [userDetails, workerLocation]);

  const renderJobs = (status) => {
    const handleJob = async (job, isAccept, price = 0) => {
      try {
        price = parseFloat(price);
  
        const response = await fetch(`${config.API_BASE_URL}/advertisement/bid`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: job._id,
            worker_name: userDetails.name,
            worker_id: userDetails.id,
            price,
          }),
        });
  
        if (response.ok) {
          fetchJobs();
        } else {
          console.error('Failed to bid to job');
        }
      } catch (error) {
        console.error('Error bidding to job:', error);
      }
    };

    const cancelJob = async (job) => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/advertisement/cancelJob`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: job._id,
          }),
        });
  
        if (response.ok) {
          fetchJobs();
        } else {
          console.error('Failed to bid to job');
        }
      } catch (error) {
        console.error('Error bidding to job:', error);
      }
    };
    
    const finishJob = async (job) => {
      try {
        const response = await fetch(`${config.API_BASE_URL}/advertisement/finish`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: job._id,
          }),
        });
  
        if (response.ok) {
          const res = await response.json();
          console.log(res);
          fetchJobs();
        } else {
          console.error('Failed to finish job');
        }
      } catch (error) {
        console.error('Error finishing job:', error);
      }
    };

    return jobs
      .filter((job) => job.status === status && workerJobTypes.includes(job.job_type))
      .map((job, index) => {
        if (job.status == 'Active' && job.selectedWorkers.some((worker) => worker.worker_id == userDetails.id)) {
          return (
            <li key={index}>
              <JobCard job={job} cancelJob={cancelJob} finishJob={finishJob} handleJob={handleJob} userDetails={userDetails} />
            </li>
          );  
        } else if (job.worker_id == userDetails.id) {
          return (
            <li key={index}>
              <JobCard job={job} cancelJob={cancelJob} finishJob={finishJob} handleJob={handleJob} />
            </li>
          );  
        } else {
          return;
        } 
      });
    };

  return (
    <div className="container mx-auto p-4">
      <div className="pt-10">
        <Typography variant="h3" color="black" className="mb-2">
          Active Jobs
        </Typography>
        {jobs.filter((job) => job.status === "Active").length === 0 || !jobs.some(job => job.selectedWorkers.some((worker) => worker.worker_id == userDetails.id)) ? (
          <Typography variant="h4" color="black" className="mb-2">
            No active jobs to display.
          </Typography>
        ) : <ul>{renderJobs("Active")}</ul>}
      </div>

      <div style={{ marginTop: "100px" }}>
        <Typography variant="h3" color="black" className="mb-2">
          Accepted Jobs
        </Typography>
        {jobs.filter((job) => job.status === "Accepted").length === 0 || !jobs.filter((job) => job.status === "Accepted").some((job) => job.worker_id == userDetails.id) ? (
          <Typography variant="h4" color="black" className="mb-2">
            No accepted jobs to display.
          </Typography>
        ) : <ul>{renderJobs("Accepted")}</ul>}
      </div>
    </div>
  );
}

export default WorkerProfilePage;
