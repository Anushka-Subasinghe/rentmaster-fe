import React, {useEffect, useState} from 'react';
import SimpleMap from './map';
import ProfileNavbar from './profileNavbar';
import config from "@/config";

const locationCoords = {
    nugegoda: [6.863233, 79.900682],
    dehiwala: [6.851073, 79.865213],
    moratuwa: [6.787753, 79.884981],
    piliyandala: [6.801574, 79.922324],
    kollupitiya: [6.911891, 79.851588]
};

function generatePopularAreas() {
    const userInteractionData = {
      user1: ["nugegoda", "dehiwala", "moratuwa"],
      user2: ["piliyandala", "dehiwala"],
      user3: ["nugegoda", "piliyandala", "dehiwala", "kollupitiya"],
      // Add more user interactions as needed
    };
    
    const areaCounts = {};
    
    for (const user in userInteractionData) {
      const areas = userInteractionData[user];
      
      for (const area of areas) {
        if (area in areaCounts) {
          areaCounts[area]++;
        } else {
          areaCounts[area] = 1;
        }
      }
    }  
    const sortedAreas = Object.entries(areaCounts).sort((a, b) => b[1] - a[1]);
  
  // Return the top N popular job types (e.g., top 5)
  const topPopularAreas = sortedAreas.slice(0, 5).map(([area]) => area);
        
  const popAreas = topPopularAreas.filter((value, index) => index == 0 || index == 1);   
  const popAreaCoords = popAreas.map((area) => {
      console.log(locationCoords.hasOwnProperty(area))
      if (locationCoords.hasOwnProperty(area)) {
          return {
            area: area, // Use "area" as the property name
            coords: locationCoords[area] // Use "coords" as the property name for the coordinates
          };
      }
  })
  
  console.log(popAreaCoords);
  return popAreaCoords;
};

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

  const calculateProximity = (location) => {
    // Simple Euclidean distance formula for proximity using latitude and longitude
    const dx = location.userLatitude - location.jobLatitude;
    const dy = location.userLongitude - location.jobLongitude;
    return Math.sqrt(dx * dx + dy * dy);
  };

const fetchJobs = async (workerJobTypes, setJobs, userLocation, user) => {
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
          const distance = userLocation.latitude == 0 ? 0 : calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            job.latitude,
            job.longitude,
          );
          return ({
          ...job,
          proximity: calculateProximity({ jobLatitude: job.latitude, jobLongitude: job.longitude, userLatitude: userLocation.latitude, userLongitude: userLocation.longitude }),
          distance: distance,
        })});
        jobsWithProximity.sort((a, b) => a.proximity - b.proximity);
        
        console.log(`jobsWithProximity`, jobsWithProximity);

        const currentWorkerJobs = jobsWithProximity.filter((j) => j.worker_id == user.id);
        console.log(`currentWorkerJobs`, currentWorkerJobs);
        setJobs(currentWorkerJobs);
      } else {
        console.error("Failed to fetch ads");
      }
    } catch (error) {
      console.error("Error fetching ads:", error);
    }
  };

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

  const PopularJobTypesPopup = ({ jobTypes }) => {
    return (
      
      <div className="sidebar-content" style={{
        marginTop: '20px',
        position: 'absolute',
        top: 400,
        left: 100,
        width: '500px',
        height: '150px',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '20px',
        overflowY: 'auto',
        boxShadow: '-2px 0 5px rgba(0, 0, 0, 0.1)',
        transform: 'translate(0, 50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '15px',
        overflow: 'hidden', // Fix 'overflow: false' typo
        fontSize: '20px', // Increase the font size
        }}>
        <h1 style={{ color: 'green', marginBottom: '15px', fontSize: '24px' }}>Popular Job Types</h1>
        <ul>
        {jobTypes.map((jobType, index) => (
                <li key={index} style={{ fontSize: '22px' }}>{jobType}</li>
              ))}
        </ul>
      </div>
    
    );
  };

  const PopularAreasPopup = ({ areas }) => {
    return (
      
        <div className="sidebar-content" style={{
            marginTop: '20px',
            position: 'absolute',
            top: 200,
            left: 100,
            width: '500px',
            height: '150px',
            backgroundColor: '#fff',
            border: '1px solid #ccc',
            borderRadius: '20px',
            overflowY: 'auto',
            boxShadow: '-2px 0 5px rgba(0, 0, 0, 0.1)',
            transform: 'translate(0, 50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '15px',
            overflow: 'hidden', // Fix 'overflow: false' typo
            fontSize: '20px', // Increase the font size
            }}>
            <h1 style={{ color: 'green', marginBottom: '15px', fontSize: '24px' }}>Popular Areas</h1> {/* Increase the font size */}
            <ul>
              {areas.map((area, index) => (
                <li key={index} style={{ fontSize: '22px' }}>{area.area}</li>
              ))}
            </ul>
          </div>
    
    );
  };  

export function Recommendations() {
    const [userLocation, setUserLocation] = useState({latitude: 10.99835602, longitude: 77.01502627});
    const [userDetails, setUserDetails] = useState(null);
    const [jobs, setJobs] = useState(null);

    useEffect(() => {
        getCurrentLocation()
  .then(location => {
    setUserLocation({latitude: location.latitude, longitude: location.longitude});
  })
  .catch(error => {
    console.error('Error getting location:', error);
  });
      }, []);

      useEffect(() => {
        setUserDetails(JSON.parse(localStorage.getItem('userDetails')))
  },[]);
    
  const popularAreas = generatePopularAreas();
  const popularJobs = generatePopularJobTypes();

  useEffect(() => {
    if (userDetails !== null && userDetails.user_type == 'worker') {
        const jobTypes = userDetails.job_types;
        fetchJobs(jobTypes, setJobs, userLocation, userDetails);    
    }
  }, [userDetails])

  useEffect(() => {
    console.log(`jobs2`, jobs);
  }, [jobs])

  return (
 <>
 <div style={{ marginLeft: '250px' }}>
            <ProfileNavbar currentPage='recommendations' />
      </div>
    <SimpleMap key={jobs !== null ? 1 : 0} location={userLocation} popularAreas={popularAreas} popularJobTypes={popularJobs} user={userDetails} jobs={jobs} />
    {userDetails !== null ? <div><PopularAreasPopup areas={popularAreas} />
    <PopularJobTypesPopup jobTypes={popularJobs} /> </div> : <div/>}
  </>
  );
}

export default Recommendations;
