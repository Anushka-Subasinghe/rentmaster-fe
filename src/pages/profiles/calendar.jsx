import React, { useState, useEffect } from "react";
import Fullcalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import config from "@/config";
import ProfileNavbar from './profileNavbar';

const fetchJobs = async (workerJobTypes, setJobs, user) => {
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
        const currentWorkerJobs = adds.filter((j) => j.worker_id == user.id);
        setJobs(currentWorkerJobs);
      } else {
        console.error("Failed to fetch ads");
      }
    } catch (error) {
      console.error("Error fetching ads:", error);
    }
  };

export function Calendar() {
    const [userDetails, setUserDetails] = useState(null);
    const [jobs, setJobs] = useState(null);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        setUserDetails(JSON.parse(localStorage.getItem('userDetails')))
  },[]);

  useEffect(() => {
    if (userDetails !== null && userDetails.user_type == 'worker') {
        const jobTypes = userDetails.job_types;
        fetchJobs(jobTypes, setJobs, userDetails);    
    }
  }, [userDetails])

  useEffect(() => {
    console.log(`jobs2`, jobs);
    if (jobs !== null) {
        const eve = jobs.map((job) => {
            return {
                title: `${job.customer_name} - ${job.job_type}`,
                start: `${job.date}T${job.time}:00`
            }     
        });
        setEvents(eve);
    }
  }, [jobs])


  return (
    <>
    <div style={{ marginLeft: '250px' }}>
            <ProfileNavbar currentPage='calendar' isCustomer={userDetails ? userDetails.user_type == 'customer' : false} />
            </div>
    <div>
      <Fullcalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        events={events}
        initialView={"dayGridMonth"}
        headerToolbar={{
          start: "today prev,next", // will normally be on the left. if RTL, will be on the right
          center: "title",
          end: "dayGridMonth,timeGridWeek,timeGridDay", // will normally be on the right. if RTL, will be on the left
        }}
        height={"90vh"}
      />
    </div>
    </>
  );
}

export default Calendar;