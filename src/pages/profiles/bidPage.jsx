import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Card,
    CardBody,
    Typography,
    Button,
    Input,
  } from "@material-tailwind/react";
import badWeather from '../../assets/badWeather.jpg';
import { appRoutes } from '@/data';
import WeatherDetails from './weatherDetails';
import "./weatherStyles.css";
import config from "@/config";

const PriceCard = ({ userDetails, prediction = false, type, job }) => {
    const [price, setPrice] = useState(0);
    const [percentage, setPercentage] = useState(0);

    const navigate = useNavigate();

    const handleJob = async (job) => {
        try {
    
          const response = await fetch(`${config.API_BASE_URL}/advertisement/bid`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: job._id,
              worker_name: userDetails.name,
              worker_id: userDetails.id,
              price: parseFloat(price + (price * percentage / 100)),
            }),
          });
    
          if (response.ok) {
            navigate(appRoutes.secureRouts.myProfile, {replace: true});
          } else {
            console.error('Failed to bid to job');
          }
        } catch (error) {
          console.error('Error bidding to job:', error);
        }
      };
  
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
  
    const handleSubmit = async (job) => {
        await handleJob(job);
    };

    const cardStyle = {
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '400px', // Set a maximum width
        margin: '0 auto', // Center horizontally
        border: 'none',
        borderRadius: 0,
      };
  
    return (
      
          <div className="justify-center items-center" style={{ "backgroundColor": 'white', border: 'none', width: '800px', marginLeft: '200px' }}>
            <Card style={cardStyle}>
              <CardBody className="text-center" style={{ border: 'none', justifyContent: 'center', alignItems: 'center' }}>
                {!prediction ? <div style={{ width: '500px', justifyContent: 'center', alignItems: 'center', paddingRight: '100px' }}>
                  <img src={badWeather} alt="Warning" />
                  <Typography variant="h4" color="red" className="mb-2">
                    The conditions are not suitable for this job.
                  </Typography>
                  <Typography variant="h4" color="blue" className="mb-2">
                  You will get an extra {percentage}% added to your price.
                  </Typography>
                </div> : <div />}
                <div className="mt-4" style={{ width: '500px', paddingRight: '100px' }}>
                  <Input label="Enter Price" onChange={handlePriceChange} />
                </div>
                <div className="mt-4" style={{ width: '500px', paddingRight: '100px' }}>
                <Button variant="gradient"  onClick={() => handleSubmit(job)}>Submit Price</Button>
                </div>
              </CardBody>
            </Card>
          </div>
     
    );
  }

export function BidPage () {
    const location = useLocation();
    const { userDetails, job } = location.state;

    const closeStyle = {
        position: 'absolute',
        top: '0px',
        right: '10px',
        fontSize: '36px',
        color: '#E13E3E',
        cursor: 'pointer',
      };

  console.log('userDetails:', userDetails);
  console.log('selectedJob:', job);
    return (
        <div className="flex animated-background" >
        <span style={closeStyle} onClick={() => navigate(appRoutes.secureRouts.myProfile)}>&times;</span>
        <div style={{ width: '1000px' }}> {/* Adjust the width as needed */}
            <PriceCard type={job.job_type} userDetails={userDetails} job={job}  />
        </div>
        <div style={{ height: '100%' }}> {/* Adjust the width as needed */}
            <WeatherDetails job={job} />
        </div>
        
        </div>
        
    );
}

export default BidPage;