import React, { useState, useEffect } from "react";
import {
  Card,
  CardFooter,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import config from "@/config";
import { Ripple, initTE } from "tw-elements";

// Initialize Tailwind Elements (TE) with the Ripple component
initTE({ Ripple });

{/* <div className="flex justify-between mb-2">
                  <span>Job Type: {job.job_type}</span>
                  <span>Date: {job.date}</span>
                  <span>Time: {job.time}</span>
                  <span>Customer: {job.customer_name}</span>
                  <span>Weather Forecast: {job.forecast}</span>
                  <span>Distance: {parseFloat(job.distance.toFixed(2))}km</span>
                  {status === 'Active' ? (
                    <Button color="blue" onClick={() => handleJob(job._id, true)}>
                      Accept Job
                    </Button>
                  ) : <Button color="red" onClick={() => handleJob(job._id, false)}>
                  Cancel Job
                </Button>}
                </div> */}

const JobCard = ({job, handleJob}) => {
  return (
    <Card className="mt-6 flex flex-row" style={{ width: '1000px' }}>
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
          {job.forecast}
        </Typography>
        <Typography variant="h6" color="blue">
          Distance:&nbsp;&nbsp;
        </Typography>
        <Typography className="mr-6">
          {parseFloat(job.distance.toFixed(2))}km
        </Typography>
        {job.status === 'Active' ? (
                    <Button color="blue" onClick={() => handleJob(job._id, true)}>
                      Accept Job
                    </Button>
                  ) : <Button color="red" onClick={() => handleJob(job._id, false)}>
                  Cancel Job
                </Button>}
      </CardBody>
    </Card>
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
    console.log(location.latitude, location.longitude);
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
    const handleJob = async (jobId, isAccept) => {
      try {
        // Send a request to update the job status to "Accepted"
        const response = await fetch(`${config.API_BASE_URL}/advertisement`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: jobId,
            status: isAccept ? 'Accepted' : 'Active',
            worker_name: isAccept ? userDetails.name : '',
            worker_id: isAccept ? userDetails.id : ''
          }),
        });
  
        if (response.ok) {
          fetchJobs();
        } else {
          console.error('Failed to accept job');
        }
      } catch (error) {
        console.error('Error accepting job:', error);
      }
    };

    return jobs
      .filter((job) => job.status === status && workerJobTypes.includes(job.job_type))
      .map((job, index) => {
        return (
          <li key={index}>
            <JobCard job={job} handleJob={handleJob} />
          </li>
        );
      });
    };

  return (
    <div style={{ marginLeft: "10%", marginTop: "100px" }}>
      <div>
        <Typography variant="h3" color="white" className="mb-2">
          Active Jobs
        </Typography>
        <ul>{renderJobs("Active")}</ul>
      </div>

      <div style={{ marginTop: "100px" }}>
        <Typography variant="h3" color="white" className="mb-2">
          Accepted Jobs
        </Typography>
        <ul>{renderJobs("Accepted")}</ul>
      </div>
    </div>
  );
}

export default WorkerProfilePage;
