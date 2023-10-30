import React from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";

export function WeatherDetails({ job }) {
    console.log(`weatherdetails`, job.forecast)
  return (
    
      <MDBContainer className="h-100" style={{ backgroundColor: 'white', height: '100%', border: 'none', marginRight: '200px', width: '700px' }}>
        <MDBRow className="justify-content-center align-items-center h-100" style={{ backgroundColor: 'white', height: '80%', border: 'none' }}>
          <MDBCol style={{ width: '100%' }}>
            <MDBCard style={{ color: "#4B515D", borderRadius: "35px", border: 'none', width: '100%' }}>
              <MDBCardBody className="p-4" style={{ backgroundColor: 'white', height: '590px', width: '100%', border: 'none' }}>
                <div className="d-flex flex-column text-center mt-5 mb-4">
                  <MDBTypography
                    tag="h6"
                    className="display-4 mb-0 font-weight-bold"
                    style={{ color: "#1C2331", fontSize: '3rem' }}
                  >
                    {" "}
                    {job.forecast.temperature}°C
                  </MDBTypography>
                  <span className="small" style={{ color: "#868B94", fontSize: '1.5rem' }}>
                  {job.forecast.weather}
                  </span>
                </div>

                <div className="d-flex align-items-center" style={{ paddingTop: '200px' }}>
                  <div className="flex-grow-1" style={{ fontSize: '1.5rem' }}>
                    <div>
                      <MDBIcon
                        fas
                        icon="wind fa-fw"
                        style={{ color: "#868B94", fontSize: '2rem' }}
                      />{" "}
                      <span className="ms-1"> {job.forecast.windspeed} km/h</span>
                    </div>
                    <div>
                      <MDBIcon
                        fas
                        icon="tint fa-fw"
                        style={{ color: "#868B94", fontSize: '2rem' }}
                      />{" "}
                      <span className="ms-1"> {job.forecast.humidity}% </span>
                    </div>
                  </div>
                  <div>
                    <img
                      src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-weather/ilu1.webp"
                      width="150px" // Increase the width of the image
                    />
                  </div>
                </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
 
  );
}

export default WeatherDetails;
