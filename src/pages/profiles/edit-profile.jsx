import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import placeHolder from "../../assets/profilePlaceHolder.jfif";
import { appRoutes } from '@/data';
import config from "@/config";

export function EditProfile() {
  const navigate = useNavigate();  

  useEffect(() => {
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));
    setFormData({
        id: userDetails.id,
        name: userDetails.name,
        email: userDetails.email,
        phone: userDetails.phone,
        profile_picture: userDetails.profile_picture,
        user_type: userDetails.user_type
    });
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    id: '',
    user_type: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    fetch(`${config.API_BASE_URL}/user/updateProfile`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
          },
        body: JSON.stringify({username: formData.name, email: formData.email, phone: formData.phone ? formData.phone : '', id: formData.id, user_type: formData.user_type, rating: 5}),
      })
      .then(async (response) => {
            const data = await response.json();
            localStorage.setItem('userDetails', JSON.stringify(data));
            navigate(appRoutes.secureRouts.myProfile, {replace: true});
          
        })
        .catch((error) => {
          console.error(error);
        });
  };

  function handleProfilePictureChange(event, id) {
    const file = event.target.files[0];

    if (file) {
        const formData = new FormData();
        formData.append('file', file);
    
        fetch(`${config.API_BASE_URL}/user/profilePicture/${id}`, {
          method: 'POST',
          body: formData,
        })
          .then(async (response) => {
            const data = await response.json();
            const storedData = localStorage.getItem('userDetails');
            let yourObject = JSON.parse(storedData);

            // Check if the object exists in localStorage
            if (yourObject) {
                // Step 2: Modify the property of the object
                yourObject.profile_picture = data.profile_picture;

                // Step 3: Save the updated object back to localStorage
                localStorage.setItem('userDetails', JSON.stringify(yourObject));
                navigate(appRoutes.secureRouts.myProfile, {replace: true});
            }
          })
          .catch((error) => {
            // Handle any errors
          });
      }
  }

  return (
    <div className="container-xl px-4 mt-20">
      <div className="row">
        <div className="col-xl-4">
          <div className="card mb-4 mb-xl-0">
            <div className="card-header">Profile Picture</div>
            <div className="card-body text-center">
            <input
                        type="file"
                        accept="image/*"
                        id="profilePictureInput"
                        style={{ display: 'none' }}
                        onChange={(e) => handleProfilePictureChange(e, formData.id)}
                        />
                        <label htmlFor="profilePictureInput">
              <img className="img-account-profile rounded-circle mb-2" src={formData.profile_picture ? `data:image/png;base64, ${formData.profile_picture}` : placeHolder} alt="Profile Picture" style={{ cursor: 'pointer' }} />
              </label>
            </div>
          </div>
        </div>
        <div className="col-xl-8">
          <div className="card mb-4">
            <div className="card-header">Account Details</div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="small mb-1" htmlFor="inputUsername">Username (how your name will appear to other users on the site)</label>
                  <input
                    className="form-control"
                    id="inputUsername"
                    type="text"
                    name="name"
                    placeholder="Enter your username"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="small mb-1" htmlFor="inputEmailAddress">Email address</label>
                  <input
                    className="form-control"
                    id="inputEmailAddress"
                    type="email"
                    name="email"
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="row gx-3 mb-3">
                  <div className="col-md-6">
                    <label className="small mb-1" htmlFor="inputPhone">Phone number</label>
                    <input
                      className="form-control"
                      id="inputPhone"
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <button className="btn btn-primary bg-blue-300 hover:bg-blue-400 border-none" type="submit">Save changes</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditProfile;