import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '@/config';
import ProfileNavbar from './profileNavbar';
import annyang from 'annyang';
import moment from 'moment-timezone';
import { toast } from 'react-toastify';
import { Widget, addResponseMessage, dropMessages, setQuickButtons, toggleWidget, addUserMessage, isWidgetOpened } from 'react-chat-widget';
import 'react-chat-widget/lib/styles.css';
import { appRoutes } from '@/data';
const chatBotUrl = config.CHATBOT_URL;

const handleNewUserMessage = (newMessage) => {
    console.log(`New message incoming! ${newMessage}`);
    // Now send the message through the backend API
  };

  

  const getMinTime = () => {
    const now = new Date();
    const formattedMinTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    return formattedMinTime;
  }

function ChatPage() {
    const [jobType, setJobType] = useState(null);
    const [date, setDate] = useState('');
    const [time, setTime] = useState(getMinTime());
    const [location, setLocation] = useState([0, 0]);
    const [buttonType, setButtonType] = useState('initial');
    const [buttons, setButtons] = useState([{label: 'Yes', value: 'Yes', buttonClassName: 'custom-quick-button', type: 'affirm'}, {label: 'No', value: 'No', buttonClassName: 'custom-quick-button', type: 'decline'}]);
    const navigate = useNavigate();

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
    
      

    // Voice Recognition
  const initVoiceRecognition = () => {
    const commands = {}
    buttons.map((button) => {
      commands[button.label] = () => {
        // When the user says a button label, trigger the corresponding action
        handleQuickButtonClicked(button.label, button.type);
      };    
    });
    annyang.addCommands(commands);
    console.log(`annyang initialized`)
    annyang.start();
  };

  // Text-to-Speech (TTS) function
  const speakResponse = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      speechSynthesis.speak(utterance);
    }
  };

  const getWeatherForecast = async () => {
  
    const timeZone = 'Asia/Kolkata';

    // Combine the date and time and format it
    const combinedDateTime = moment(`${date} ${time}`, 'YYYY-MM-DD HH:mm').tz(timeZone);
  
    // Convert the combined date and time to a Unix timestamp (in seconds)
    const timestamp = combinedDateTime.unix();
    console.log(timestamp)

    const apiKey = "38bde97caffcf4daa9adbfedb5fee58f";
    const apiUrl = `https://api.openweathermap.org/data/3.0/onecall/timemachine?lat=${location[0]}&lon=${location[1]}&dt=${timestamp}&appid=${apiKey}`;
    
    try {
      const response = await fetch(apiUrl);
      if (response.ok) {
        const data = await response.json();
        // Assuming the jobDate is in YYYY-MM-DD format
        const jobForecast = {weather: data.data[0].weather[0].description, temperature: parseFloat((data.data[0].temp - 273.15).toFixed(1)), humidity: data.data[0].humidity, windspeed: parseFloat(data.data[0].wind_speed.toFixed(1))};
        console.log(data);
        return jobForecast;
      } else {
        console.error("Failed to fetch weather forecast");
        return null;
      }
    } catch (error) {
      console.error("Error fetching weather forecast:", error);
      return null;
    }
  };

  const handleSubmit = (event, isChatBot = false) => {
    if (event !== null) {
      event.preventDefault();  
    }

    const type = localStorage.getItem('jobType');
    const d = localStorage.getItem('date');
    const userDetails = JSON.parse(localStorage.getItem('userDetails'));

    // Check if all required fields are selected
    if ((!isChatBot ? jobType.length == 0 : type.length == 0) || (!isChatBot ? date.length == 0: d.length == 0) || time.length == 0) {
      console.log('Please select all required fields.');
      toast.error('Please select all required fields.');
      return;
    }

    getWeatherForecast().then((forecast) => {
      // Send a request to post the advertisement to the backend
      console.log(forecast)
      fetch(`${baseUrl}/advertisement`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userDetails.email,
        date: isChatBot ? d : date,
        time: time,
        job_type: isChatBot ? type : jobType,
        status: "Active",
        latitude: location[0],
        longitude: location[1],
        forecast: forecast !== null ? forecast : {
          weather: "light rain",
          temperature: 28.3,
          humidity: 69,
          windspeed: 3.6
        },
        work_type: (!isChatBot ? (jobType == 'cleaner' || jobType == 'electrician' || jobType == 'plumber') : (type == 'cleaner' || type == 'electrician' || type == 'plumber')) ? 1 : 0,
      }),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Advertisement posted successfully:', data);
        localStorage.removeItem('jobType');
        localStorage.removeItem('date');
        localStorage.removeItem('buttonType');
        navigate(appRoutes.secureRouts.myProfile, {replace: true});
        return data;
      })
      .catch(error => {
        console.error('Error posting advertisement:', error);
      });    
    });
  };

  // Initialize voice recognition and TTS when the component mounts
  useEffect(() => {
    initVoiceRecognition();
    
    if(!isWidgetOpened()){
      toggleWidget();
    }
    
    return () => {
      annyang.removeCommands();
      annyang.abort();
    };
  }, []);

    useEffect(() => {
      setQuickButtons(buttons); 
      console.log('setButtons'); 
    },[buttons]);

    const handleNewUserMessage = (newMessage) => {
      console.log(`New message incoming! ${newMessage}`);
      // Now send the message through the backend API
    };

    const speakButtonLabels = (speakButtons) => {
      if (buttons.length > 0) {
        const buttonLabels = speakButtons.map((button) => button.label).join(', ');  

        if (speakButtons[0].label.includes('-')) {
          buttonLabels.split(', ').map((label, index) => {
            speakResponse(`Select ${index + 1} to choose ${label}`);    
          })
        } else {
          speakResponse(`You can choose from the following options: ${buttonLabels}`);    
        }
        // Add the button labels as new voice commands
        const commands = {};
        speakButtons.map((button, index) => {
          console.log(button.label)
          if (button.label.includes('-')) {
            console.log(`${index + 1}`);
            commands[`${index + 1}`] = () => {
              // When the user says a button label, trigger the corresponding action
              handleQuickButtonClicked(button.label, button.type);
            };  
          } else {
            commands[button.label] = () => {
              // When the user says a button label, trigger the corresponding action
              handleQuickButtonClicked(button.label, button.type);
            };  
          }
        });

        // Add the new voice commands to annyang
        annyang.addCommands(commands);
      } else {
        speakResponse(`There are no options available.`);
      }
    };

    const handleQuickButtonClicked = async (newMessage, type = null) => {
      console.log(`QuickButtonCLicked! ${newMessage}`);
      console.log("buttonType" + buttonType);
      console.log("jobType" + jobType);
      console.log("date" + date);
      console.log("time" + time);
      // console.log("Type" + type);
      addUserMessage(newMessage);
      if (buttonType == 'jobType' || type == 'jobType') {
        setJobType(newMessage);
        localStorage.setItem('jobType', newMessage);
      }
      if (buttonType == 'date' || type == 'date') {
        setDate(newMessage);
        localStorage.setItem('date', newMessage);
        setButtonType(null);
        localStorage.setItem('buttonType', null);
      }
      // Now send the message through the backend API
      try {
        const response = await fetch(chatBotUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: newMessage }),
        });
  
        if (response.ok) {
          const message = await response.json();
          addResponseMessage(message[0].text);
          // Speak out the chatbot's response
          speakResponse(message[0].text);
          
          if (message[0].buttons) {
            console.log(message[0].buttons);
            const newButtons = message[0].buttons.map((button) => {
              return {
                label: button.title,
                value: button.title,
                buttonClassName: 'custom-quick-button',
                type: button.payload,
              };
            });
            setQuickButtons(newButtons);
            setButtons(newButtons);
            setButtonType(message[0].buttons[0].payload);
            localStorage.setItem('buttonType', message[0].buttons[0].payload);
            speakButtonLabels(newButtons);
          }
          if (message[0].text == 'Job confirmed') {
            console.log(`Job Confirmed`)
            handleSubmit(null, true);
            dropMessages();
            addResponseMessage('Hi. Do you need to request a job?');
            setButtons([
              { label: 'Yes', value: 'Yes', buttonClassName: 'custom-quick-button' },
              { label: 'No', value: 'No', buttonClassName: 'custom-quick-button' },
            ]);
          } else if (message[0].text == 'Job cancelled') {
            localStorage.removeItem('jobType');
            localStorage.removeItem('date');
            localStorage.removeItem('buttonType');
            setDate('');
            setJobType(null);
            navigate(appRoutes.secureRouts.myProfile, {replace: true});
          } else if (message[0].text == 'Goodbye') {
            console.log('Goodbye');
            navigate(appRoutes.secureRouts.myProfile, {replace: true});
          } else if (message[0].text == 'Please select job type') {
            console.log(`this toggle`);
          }
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
    };

    useEffect(() => {
        getCurrentLocation()
  .then(location => {
    console.log(location.latitude, location.longitude);
    setLocation([location.latitude, location.longitude]);
  })
  .catch(error => {
    console.error('Error getting location:', error);
  });
      }, []);

    const baseUrl = config.API_BASE_URL;  
  return (
    <div style={{ margin: 0, padding: 0 }}>
    <Widget
      key={buttons[0].label}
      title="RentMaster Chatbot"
      subtitle="Use me to request your job"
      handleNewUserMessage={handleNewUserMessage}
      handleQuickButtonClicked={handleQuickButtonClicked}
      showEmoji={false}
      loading={false}
      fullScreenMode={true}
    />
  </div>
    
  );
}

export default ChatPage;