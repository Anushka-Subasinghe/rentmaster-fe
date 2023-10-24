import React, { useState, useEffect } from 'react';
import AdvertisementCard from './advertisement-card';
import config from '@/config';

export function Advertisements() {
  const [workers, setWorkers] = useState([]);

  const baseUrl = config.API_BASE_URL;

  const getWorkers = async () => {
    try {
      const response = await fetch(`${baseUrl}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const res = await response.json();
        console.log(res);
        return res;
      } else {
        // Handle error response (e.g., incorrect credentials)
        const errorResponse = await response.text();
        console.log(errorResponse);
        toast.error(errorResponse.detail);
      }
    } catch (error) {
      toast.error('An error occurred while fetching from chatbot. Please try again later.');
      console.log('Error fetching from chatbot: ', error);
    }
  }

  useEffect(() => {
    getWorkers().then((res) => {
      setWorkers(res);
    });
  }, []);


  return (
    <div class="h-100" style={{ background: 'linear-gradient(to right, rgba(251, 194, 235, 1), rgba(166, 193, 238, 1))' }}> 
      <div className="row">
        {workers.map((worker, index) => (
            <AdvertisementCard worker={worker} />
        ))}
      </div>
    </div>
  );
}

export default Advertisements;
