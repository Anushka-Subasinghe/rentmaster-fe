import React, { useState, useEffect } from "react";
import { Typography, Card, CardBody } from "@material-tailwind/react";
import config from "@/config";

function WorkerProfilePage({ userDetails }) {
  const [jobs, setJobs] = useState([]);

  const workerJobTypes = userDetails.job_types || [];

  function isEqual(arr1, arr2) {
    return JSON.stringify(arr1) === JSON.stringify(arr2);
  }  

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
        if (!isEqual(adds, jobs)) {
            setJobs(adds);
          } 
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
    const intervalId = setInterval(fetchJobs, 10000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [userDetails, workerJobTypes]);

  const renderJobs = (status) => {
    return jobs
      .filter((job) => job.status === status && workerJobTypes.includes(job.job_type))
      .map((job, index) => (
        <li key={index}>
            <Card color="gray" className="mb-4" style={{marginTop: "20px", width: "1000px"}}>
                <CardBody>
                <div className="flex justify-between mb-2">
                    <span>Job Type: {job.job_type}</span>
                    <span>Date: {job.date}</span>
                    <span>Time: {job.time}</span>
                    <span>Customer: {job.customer_name}</span>
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
