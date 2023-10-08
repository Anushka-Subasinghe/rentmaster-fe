import React, {useEffect, useState} from 'react';
import { Typography, Input, Button } from '@material-tailwind/react';
import {useLocation} from "react-router-dom";

const CustomerJobRequestForm = () => {
    const [jobType, setJobType] = useState('');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('');

    const handleJobTypeChange = (event) => {
        setJobType(event.target.value);
    };

    const handleDateChange = (event) => {
        setDate(event.target.value);
    };

    const handleTimeChange = (event) => {
        setTime(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // Handle form submission here
        console.log('Job Type:', jobType);
        console.log('Date:', date);
        console.log('Time:', time);
    };

    return (
        <div>
            <Typography variant="h2" color="blue-gray" className="mb-2">
                Request a Job
            </Typography>
            <form onSubmit={handleSubmit}>
                <div className="my-4">
                    <Input
                        type="text"
                        placeholder="Enter type of work"
                        value={jobType}
                        onChange={handleJobTypeChange}
                    />
                </div>
                <div className="my-4">
                    <Input
                        type="date"
                        placeholder="Select date"
                        value={date}
                        onChange={handleDateChange}
                    />
                </div>
                <div className="my-4">
                    <Input
                        type="time"
                        placeholder="Select time"
                        value={time}
                        onChange={handleTimeChange}
                    />
                </div>
                <Button type="submit" color="blue">
                    Submit Request
                </Button>
            </form>
        </div>
    );
};

const CustomerProfilePage = () => {
    const location = useLocation();
    const userDetails = location.state?.userDetails || {};
    console.log("customer profile")
    return (
        <div className="container mx-auto p-4">
            <hr className="my-6" />
            <CustomerJobRequestForm />
        </div>
    );
};

export default CustomerProfilePage;
