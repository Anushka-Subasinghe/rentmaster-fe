import React, { useState, useEffect } from "react";
import { Typography, Card, CardBody, Button } from "@material-tailwind/react";
import config from "@/config";

const getCurrentLocation = () => {
    let latitude = 0;
    let longitude = 0;
    navigator.geolocation.getCurrentPosition(
        position => {
            const coords = position.coords;
            latitude = coords.latitude;
            longitude = coords.longitude;
        },
        error => {
            reject(error);
        }
    );
    return { latitude, longitude };
  };

function WorkerProfilePage({ userDetails }) {
  const [jobs, setJobs] = useState([]);
  const [workerLocation, setWorkerLocation] = useState(null);

    useEffect(() => {
        getCurrentLocation()
  .then(location => {
    console.log(location.latitude, location.longitude);
    setWorkerLocation({latitude, longitude});
  })
  .catch(error => {
    console.error('Error getting location:', error);
  });
      }, []);

  const workerJobTypes = userDetails.job_types || [];

  function isEqual(arr1, arr2) {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  }  

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
        const jobsWithProximity = adds.map(job => ({
          ...job,
          proximity: calculateProximity(workerLocation, { latitude: job.latitude, longitude: job.longitude }),
        }));
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
  }, [userDetails, workerJobTypes]);

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
      .map((job, index) => (
        <li key={index}>
          <Card color="gray" className="mb-4" style={{ marginTop: '20px', width: '1000px' }}>
            <CardBody>
              <div className="flex justify-between mb-2">
                <span>Job Type: {job.job_type}</span>
                <span>Date: {job.date}</span>
                <span>Time: {job.time}</span>
                <span>Customer: {job.customer_name}</span>
                {status === 'Active' ? (
                  <Button color="blue" onClick={() => handleJob(job._id, true)}>
                    Accept Job
                  </Button>
                ) : <Button color="red" onClick={() => handleJob(job._id, false)}>
                Cancel Job
              </Button>}
              </div>
            </CardBody>
          </Card>
        </li>
      ));
  };

  return (
    <div style={{ marginLeft: "10%", marginTop: "100px" }}>
      <div>
        <Typography variant="h3" color="blue-gray" className="mb-2">
          Active Jobs
        </Typography>
        <ul>{renderJobs("Active")}</ul>
      </div>

      <div>
        <Typography variant="h3" color="blue-gray" className="mb-2">
          Accepted Jobs
        </Typography>
        <ul>{renderJobs("Accepted")}</ul>
      </div>
    </div>
  );
}

export default WorkerProfilePage;
