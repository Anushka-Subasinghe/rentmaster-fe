import Carousel from 'react-bootstrap/Carousel';
import AdvertisementCard from './advertisement-card';
import React, {useState} from 'react';

import "./styles.css";

const UncontrolledExample = ({ workers, rotateBackground }) => {
    

    return (
        <Carousel style={{
            margin: 0,
            height: "80vh",
            width: "100vw",
            overflow: "auto",
            
        }} onSelect={rotateBackground}>
            {workers.map((worker) => (
                <Carousel.Item style={{marginLeft: '370px', marginTop: '100px'}}>
                    <AdvertisementCard worker={worker} />    
                </Carousel.Item>
            ))}
        </Carousel>
    );
}

export default UncontrolledExample;