import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  Text,
} from '@chakra-ui/react'
import { FaLocationArrow, FaTimes } from 'react-icons/fa'

import {
  useJsApiLoader,
  GoogleMap,
  MarkerF,
  InfoWindowF,
  Autocomplete,
  DirectionsRenderer,
} from '@react-google-maps/api'

export function SimpleMap({ location, popularAreas, popularJobTypes, user, jobs, recommendedWorkers = null, searched, setSearched }) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyC50LlCo2A_CLcqgKASEK_WPjKKDZf8yNM",
    libraries: ['places'],
  });

  console.log('workers inside map', recommendedWorkers);

  const center = {
    lat: location.latitude,
    lng: location.longitude
  };

  const [map, setMap] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [directionsResponse, setDirectionsResponse] = useState(null);

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef()

  useEffect(() => {
    // Fetch and set markers in the state
    const markerData = generateMarkerData();
    setMarkers(markerData);
  }, [user]);

  if (!isLoaded) {
    return <div>Loading ....</div>;
  }

  function generateMarkerData() {
    // Your code to generate or fetch marker data here
    // For example, generate the center marker and popular areas.
    const centerMarker = {
      area: 'You',
      lat: location.latitude,
      lng: location.longitude,
      job: user && user.user_type == "customer" ? 'Customer' : 'Worker',
    };

    console.log(`jobs1`, jobs);
  
    const secondaryMarkers = user && user.user_type == "worker" && jobs !== null ? jobs.map((job, index) => ({
      type: 'job',
      area: job.customer_name,
      lat: job.latitude,
      lng: job.longitude,
      job: job,
    })) : [];

    const popularMarkers = popularAreas.map((area, index) => ({
        type: 'popular',
        area: area.area,
        lat: area.coords[0],
        lng: area.coords[1],
        job: popularJobTypes[index],
      }));
  
    // Combine the markers
    const allMarkers = [centerMarker, ...secondaryMarkers, ...popularMarkers];
  
    // Save the generated markers to local storage
    localStorage.setItem('markerData', JSON.stringify(allMarkers));
  
    return allMarkers;
  }

  return (
    <Flex
      position="relative"
      flexDirection="column"
      alignItems="center"
      marginTop='100px'
      h="100vh"
      w="100vw"
    >
      <Box
        position="absolute" left={1070} top={650} style={{ borderRadius: '10px' }}
        p={12}
        borderRadius='lg'
        m={4}
        bgColor='white'
        shadow='base'
        minW='container.md'
        zIndex='1'
      >
        <HStack spacing={2} justifyContent='space-between'>
          <Box flexGrow={1}>
            <Autocomplete>
              <Input type='text' placeholder='Location' ref={originRef} />
            </Autocomplete>
            <ButtonGroup>
            <Button colorScheme='pink' type='submit' onClick={() => {
              setSearched(true);
              originRef.current.value = '';
            }}>
              Search
            </Button>
          </ButtonGroup>
          </Box>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent='center' alignItems='center'>
          <IconButton
            aria-label='center back'
            icon={<FaLocationArrow />}
            isRound
            onClick={() => {
              map.panTo(center)
              map.setZoom(15)
            }}
          />
        </HStack>
      </Box>
      <Box position="absolute" left={800} top={0} h="70%" w="40%" style={{ borderRadius: '30px' }}>
        {/* Google Map Box */}
        <GoogleMap key={`${location.latitude}`}
          center={center}
          zoom={11}
          mapContainerStyle={{ width: '100%', height: '100%', borderRadius: '10px' }}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={map => setMap(map)}
        >
          {(searched && recommendedWorkers) && recommendedWorkers.map((worker, index) => (
              <MarkerF
                key={index}
                position={{ lat: worker.location[0], lng: worker.location[1] }}
                icon={"http://maps.google.com/mapfiles/ms/icons/blue-dot.png"}
              />
          ))}
          {markers.map((marker, index) => (
            <MarkerF
              key={index}
              position={{ lat: index == 0 ? location.latitude : marker.lat, lng: index == 0 ? location.longitude : marker.lng }}
              onClick={(e) => setSelectedMarker(marker)}
              icon={index !== 0 && (marker.type == "popular" ? "http://maps.google.com/mapfiles/ms/icons/green-dot.png" : "http://maps.google.com/mapfiles/ms/icons/blue-dot.png")}
            />
          ))}
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}

          {selectedMarker && (
            <InfoWindowF
              position={selectedMarker.area == "You" ? {
                area: 'You',
                lat: location.latitude + 0.01,
                lng: location.longitude,
                job: 'Customer',
              } : {
                area: selectedMarker.area,
                lat: selectedMarker.lat + 0.01,
                lng: selectedMarker.lng,
                job: selectedMarker,
              }}
              onCloseClick={() => setSelectedMarker(null)}
            >
              {/* Content for the InfoWindow */}
              {user && user.user_type == "worker" ? <div>
                {selectedMarker.area !== 'You' ? <div>{selectedMarker.type == "job" ? <div><h3>Customer: {selectedMarker.area}</h3><p>Job Type: {selectedMarker.job.job_type}</p>
                <p>Date: {selectedMarker.job.date}</p>
                <p>Time: {selectedMarker.job.time}</p></div> : <h3>{selectedMarker.area}</h3>}</div>: <h3>{selectedMarker.area}</h3> }
              </div> : <h3>{selectedMarker.area}</h3>}
            </InfoWindowF>
          )}
        </GoogleMap>
      </Box>
    </Flex>
  );
}

export default SimpleMap;
