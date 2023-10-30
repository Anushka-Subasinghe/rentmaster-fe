import React, {useEffect, useState} from 'react';
import SimpleMap from './map';
import ProfileNavbar from './profileNavbar';
import config from "@/config";
import cleaner from "../../assets/cleaner.jpg";
import worker1 from "../../assets/worker1.jpg";
import worker2 from "../../assets/worker2.jpg";
import worker3 from "../../assets/worker3.jpg";
import worker4 from "../../assets/worker4.jpg";
import placeHolder from "../../assets/profilePlaceHolder.jfif";
import { Typography, Card, CardBody, CardHeader } from '@material-tailwind/react';
import { FaStar, FaRegStar } from 'react-icons/fa';

const locationCoords = {
    Nugegoda: [6.863233, 79.900682],
    Dehiwala: [6.851073, 79.865213],
    Moratuwa: [6.787753, 79.884981],
    Piliyandala: [6.801574, 79.922324],
    Kollupitiya: [6.911891, 79.851588]
};

// Define a function to compute the similarity score
function computeSimilarity(worker, userPreferences) {
  // Define user preferences (e.g., location, rating weights)
  const userLocation = userPreferences.location; // User's location
  const userRating = userPreferences.rating; // User's preferred rating
  
  // Compute the similarity score based on location and rating
  const locationDifference = Math.abs(worker.location - userLocation);
  const ratingDifference = Math.abs(worker.rating - userRating);

  // Define weights for location and rating (you can adjust these)
  const locationWeight = 0.6;
  const ratingWeight = 0.4;

  // Compute the overall similarity score
  const similarityScore = (
    (1 - locationWeight) * (1 - locationDifference) +
    locationWeight * (1 / (1 + locationDifference)) +
    (1 - ratingWeight) * (1 - ratingDifference) +
    ratingWeight * (1 / (1 + ratingDifference))
  );

  return similarityScore;
}

function worker({ name, contact, location, rating, jobType, profile_picture }) {
  return {
    name: name,
    contact: contact,
    location: location,
    rating: rating,
    jobType: jobType,
    profile_picture: profile_picture
  };
}



function generatePopularAreas() {
    const userInteractionData = {
      user1: ["Nugegoda", "Dehiwala", "Moratuwa"],
      user2: ["Piliyandala", "Dehiwala"],
      user3: ["Nugegoda", "Piliyandala", "Dehiwala", "Kollupitiya"],
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
          
  const popAreaCoords = topPopularAreas.map((area) => {
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
      
      <div className="sidebar-content bg-gray-700 opacity-80" style={{
        marginTop: '20px',
        position: 'absolute',
        top: 600,
        left: 100,
        width: '500px',
        minHeight: '150px',
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
        <h1 style={{ color: '#FFF', marginBottom: '10px', fontSize: '26px', fontWeight: 'bolder' }}>Popular Job Types</h1>
        <ul>
        {jobTypes.map((jobType, index) => (
                <li key={index} className='text-white' style={{ fontSize: '20px' }}>{jobType}</li>
              ))}
        </ul>
      </div>
    
    );
  };

  const PopularAreasPopup = ({ areas }) => {
    return (
      
        <div className="sidebar-content bg-gray-700 opacity-80 mt-20 pb-4 pt-4" style={{
            marginTop: '20px',
            position: 'absolute',
            top: 250,
            left: 100,
            width: '500px',
            minHeight: '150px',
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
            <h1 style={{ color: '#FFF', marginBottom: '10px', fontSize: '26px', fontWeight: 'bolder' }}>Popular Areas</h1> {/* Increase the font size */}
            <ul>
              {areas.map((area, index) => (
                <li key={index} className='text-white' style={{ fontSize: '20px' }}>{area.area}</li>
              ))}
            </ul>
          </div>
    
    );
  };  

  const ProfileCard = ({ workerDetails }) => {
  
    const generateStars = (rating) => {
      const stars = [];
      const filledStars = Math.floor(rating); // Integer part of the rating
      const remainder = (rating - filledStars) * 100; // Get the remaining percentage
  
      for (let i = 1; i <= 5; i++) {
          if (i <= filledStars) {
              stars.push(<FaStar key={i} style={{ color: 'gold' }} />);
          } else if (i === filledStars + 1) {
              // Create a partially filled star
              stars.push(
                  <div key={i} style={{ display: 'flex' }}>
                      <div style={{ width: `${(remainder / 100) * 24}px`, overflow: 'hidden' }}>
                          <FaStar style={{ color: 'gold' }} />
                      </div>
                  </div>
              );
          } else {
              stars.push(<FaRegStar key={i} style={{ color: 'gold' }} />);
          }
      }
      return (
          <div style={{ display: 'flex' }}>
              {stars}
          </div>
      );
  };
  
    const profilePictureSrc = workerDetails.profile_picture;
  
    return (
      <div className="w-96">
      <Card className="w-96">
        <CardHeader floated={false} className="h-80" style={{ position: 'relative' }}>
          <img
            id="profilePicture"
            alt="Profile Picture"
            src={profilePictureSrc}
            className="shadow-xl h-full w-full object-cover"
          />
        </CardHeader>
        <CardBody className="text-center" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Typography variant="h4" color="blue-gray" className="mb-2">
            {workerDetails.name}
          </Typography>
          <Typography color="blue-gray" className="font-medium" textGradient>
            {workerDetails.contact}
          </Typography>
          <Typography color="blue-gray" className="font-medium" textGradient>
            JobType:&nbsp;{workerDetails.jobType}
          </Typography>
          <Typography color="blue-gray" className="font-medium" textGradient style={{ display: 'flex', alignItems: 'center' }}>
            Rating:&nbsp;{generateStars(workerDetails.rating)}
          </Typography>
        </CardBody>
      </Card>
    </div>
    );
  }

export function Recommendations() {
    const [userLocation, setUserLocation] = useState({latitude: 6.911378, longitude: 79.971933});
    const [userDetails, setUserDetails] = useState(null);
    const [jobs, setJobs] = useState(null);
    const [recommendedWorkers, setRecommendedWorkers] = useState(null);
    const [searched, setSearched] = useState(false);

    useEffect(() => {
      // Sample worker data
      const workers = [
        worker({ name: 'Amara', contact: '071-1234567', location: [6.911378, 79.971933], rating: 3.5, jobType: 'cleaner', profile_picture: worker1 }),
        worker({ name: 'Kamal', contact: '071-9876543', location: [6.916788, 79.968793], rating: 3.7, jobType: 'plumber', profile_picture: worker2  }),
        worker({ name: 'Nimal', contact: '071-5555555', location: [6.906542, 79.974026], rating: 4.8, jobType: 'cleaner', profile_picture: worker3  }),
        worker({ name: 'Sunimal', contact: '071-1112223', location: [6.908499, 79.966049], rating: 2.8, jobType: 'electrician', profile_picture: worker4  }),
      ];

      // User preferences (you can customize these)
      const userPreferences = {
        location: [userLocation.latitude, userLocation.longitude], // User's preferred location [latitude, longitude]
        rating: 5.0,
      };

      // Compute and sort workers based on similarity
      const sortedWorkers = workers
        .map(worker => ({
          ...worker,
          similarity: computeSimilarity(worker, userPreferences),
        }))
        .sort((a, b) => b.similarity - a.similarity);

      console.log('Recommended Workers (sorted by similarity):');
      console.log(sortedWorkers);
      setRecommendedWorkers(sortedWorkers);
    }, []);

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
 <div key={searched ? 1 : 0} style={{display: 'flex', flexDirection: 'column', background: `url(${cleaner})`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover',}}>
 <div style={{ marginLeft: '250px' }}>
            <ProfileNavbar currentPage='recommendations' isCustomer={userDetails ? userDetails.user_type == 'customer' : false} />
      </div>
      <div style={{
        width: '100%', // Set the width to 100% to span the full width
        backgroundColor: '#F4E5D1',
        height: '100px',
        display: 'flex', // Use flexbox for centering vertically
        alignItems: 'center', // Vertically center the content
        color: 'black', // Set the text color to black
        fontSize: '24px', // Set the font size to 24px
        textAlign: 'center', // Center the text
        justifyContent: 'center',
      }}>
        <h1 className='text-black' style={{ fontSize: '28px', fontWeight: 'bolder' }}>RECOMMENDED FOR YOU!</h1>
      </div>
    <SimpleMap key={jobs !== null ? 1 : 0} location={userLocation} popularAreas={popularAreas} popularJobTypes={popularJobs} user={userDetails} jobs={jobs} recommendedWorkers={userDetails && userDetails.user_type == 'customer' ? recommendedWorkers : null} searched={searched} setSearched={setSearched}/>
    {userDetails !== null && userDetails.user_type == 'worker' ? <div><PopularAreasPopup areas={popularAreas} />
    <PopularJobTypesPopup jobTypes={popularJobs} /> </div> : <div/>}
    {searched && recommendedWorkers ? (
  <div>
    <div style={{ display: 'flex', flexDirection: 'row', overflowX: 'auto', justifyContent: 'center', marginBottom: '100px' }}>
  {recommendedWorkers.map((w, i) => (
    <div key={i} style={{ marginRight: '10px' }}>
      <ProfileCard workerDetails={w} />
    </div>
  ))}
</div>
  </div>
) : <div/>}
    </div>
  </>
  );
}

export default Recommendations;
