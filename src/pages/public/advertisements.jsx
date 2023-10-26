import React, { useState, useEffect } from 'react';
import config from '@/config';
import UncontrolledExample from './carousel';
import { appRoutes } from "@/data";
import { Link } from "react-router-dom";
import one from "../../assets/1.avif";
import two from "../../assets/2.avif";
import three from "../../assets/3.avif";
import { NavbarSimple } from "./homeNavbar";

export function Advertisements() {
  const [workers, setWorkers] = useState([]);
  const [backgroundIndex, setBackgroundIndex] = useState(0);

    const backgroundImages = [
        one, two, three
    ];  


    const rotateBackground = () => {
        // Increment the background image index, and loop back to 0 if it exceeds the number of images.
        setBackgroundIndex((backgroundIndex + 1) % backgroundImages.length);
    };

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
    <div style={{
      margin: 0,
      background: `url(${backgroundImages[backgroundIndex]})`,
      backgroundSize: "cover",
      height: "100vh",
      width: "100vw",
      overflow: "auto",
      
  }}>
          
          <div style={{ marginLeft: '250px' }}>
            <NavbarSimple currentPage='advertisements' />
          </div>  
          
        <UncontrolledExample workers={workers} rotateBackground={rotateBackground} />
    </div>
      
 
  );
}

export default Advertisements;
