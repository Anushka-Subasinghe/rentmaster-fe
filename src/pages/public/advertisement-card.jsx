import React from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import placeHolder from "../../assets/profilePlaceHolder.jfif";
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';

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





export function AdvertisementCard({ worker }) {
    return (
        <div className="container py-5 h-100">
            <div className="row d-flex justify-content-center align-items-center h-100">
                <div className="col col-lg-9 col-xl-7">
                    <div className="card">
                        <div className="rounded-top text-white d-flex flex-row" style={{ background: 'linear-gradient(to right, #4b6cb7, #182848)', height: '200px' }}>
                            <div className="ms-4 mt-5 d-flex flex-column" style={{ width: '150px' }}>
                                <img
                                    src={worker.profile_picture ? `data:image/png;base64, ${worker.profile_picture}` : placeHolder}
                                    alt="Generic placeholder image"
                                    className="img-fluid img-thumbnail mt-4 mb-2"
                                    style={{ width: '150px', zIndex: 1 }}
                                />
                                
                            </div>
                            <div className="ms-3" style={{ marginTop: '130px' }}>
                                <h5>{worker.username}</h5>
                            </div>
                        </div>
                        <div className="p-4 text-black" style={{ backgroundColor: '#f8f9fa' }}>
                            <div className="d-flex justify-content-end text-center py-1" />
                        </div>
                        <div className="card-body p-4 text-black">
                            <div className="mb-5">
                                <p className="lead fw-normal mb-1">About</p>
                                <div className="p-4" style={{ backgroundColor: '#f8f9fa' }}>
                                    <p className="font-italic mb-1">Email:&nbsp;{worker.email}</p>
                                    <p className="font-italic mb-1">Phone:&nbsp;{worker.phone}</p>
                                    <p className="font-italic mb-1">Job Types:&nbsp;{worker.job_types.join(', ')}</p>
                                    <p className="font-italic mb-0" style={{ display: 'flex', alignItems: 'center' }}>Rating:&nbsp;{generateStars(4.4)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdvertisementCard;