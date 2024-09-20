import { useEffect, useRef, useState } from 'react';
import './App.css';
 import clear_icon from './assets/clear.png'
 import cloud_icon from './assets/cloud.png'
 import rain_icon from './assets/rain.png'
 import thunderstorm_icon from './assets/thunderstorm.png'
 import drizzle_icon from './assets/drizzle.png'
import snow_icon from './assets/snow.png'
import mist_icon from './assets/mist.png'



function App() {
  const [currentDateTime, setCurrentDateTime] = useState({
    date: '',
    time: '',
    dayName: '',
  });

  const [searchquery, setsearchquery] = useState()

  const [city, setcity] = useState('Delhi');
  const [wetherdata, setwetherdata] = useState('');

  const inputRef = useRef(null);

  // Update current date and time every second
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentDateTime(getCurrentDateTime());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleInputChange = () => {
    setcity(inputRef.current.value);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleInputChange();
    }
  };


  const allIcons ={
    "01d":clear_icon,
    "01n":clear_icon,
    "02d":cloud_icon,
    "02n":cloud_icon,
    "03d":cloud_icon,
    "03n":cloud_icon,
    "04d":drizzle_icon,
    "04n":drizzle_icon,
    "09d":rain_icon,
    "09n":rain_icon,
    "10d":rain_icon,
    "10n":rain_icon,
    "13d":snow_icon,
    "13n":snow_icon,
    "50dn":mist_icon,
    "50n":mist_icon,
    "11d":thunderstorm_icon,
    "11n":thunderstorm_icon,
  }

  const search = async (city) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${import.meta.env.VITE_APP_ID}`
      );
      const data = await res.json();
     
      const icon = allIcons[data.weather[0].icon] || clear_icon

      if (res.ok) {
        setwetherdata({
          location: data.name,
          humidity: data.main.humidity,
          pressure: data.main.pressure,
          windspeed: data.wind.deg,
          sealevel: data.main.sea_level,
          temperature: Math.round(data.main.temp - 273.15), // Convert to Celsius
          country: data.sys.country,
          sunrise: convertUnixToStandardTime(data.sys.sunrise), // Convert Unix to standard time
          sunset: convertUnixToStandardTime(data.sys.sunset),   // Convert Unix to standard time
          nature: data.weather[0].main,
          description: data.weather[0].description,
          icon:icon,


        });
        console.log(data);                   //loging data to check
       

      } else {
        throw new Error('City not found');
      }
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    search(city);
  }, [city]);

  // Function to convert Unix timestamp to 12-hour AM/PM format
  const convertUnixToStandardTime = (timestamp) => {
    const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  // Function to get the current date, live time, and day name
  const getCurrentDateTime = () => {
    const currentDate = new Date();

    // Format date as YYYY-MM-DD
    const date = currentDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });

    // Get live time in HH:MM:SS format
    const time = currentDate.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });

    // Get the day of the week (e.g., Monday)
    const dayName = currentDate.toLocaleDateString('en-GB', { weekday: 'long' });

    return { date, time, dayName };
  };


  return (




    <div className="wether   h-screen w-full ">


      <div className="video-background flex items-center justify-center">
        <video autoPlay muted loop className="video-bg" src="./weather.mp4" type="video/mp4">


        </video>




        <div className="container sm:flex-col sm:flex sm:h-4/5 sm:text-sm  font-normal align-middle lg:w-2/3 lg:h-2/3  text-white lg:flex lg:flex-row  text-center rounded-b-3xl  border-orange-300 border-b-8  hover:border-blue-950   hover:shadow-2xl hover:shadow-blue-950 shadow-yellow-700 shadow-xl rounded-lg ">
          <div className="left   sm:w-auto sm:h-1/2 sm:m-2 lg:m-0   lg:w-3/4  lg:h-full flex flex-col  relative rounded-l-3xl   bg-black  bg-opacity-80 ">


            <span className=" w-auto h-auto    mx-5 mt-3  lg:text-5xl font-thin flex justify-between">
              <span className='left-top self-start'><h2>{wetherdata.location}</h2>
                <h3 className='text-end text-xl pr-2'>{wetherdata.country}</h3></span>



              <span className='left-right flex flex-col self-start'>
                <h2 className='self-start'>{wetherdata.nature}</h2>
                <h3 className='self-end text-2xl pr-2'>{wetherdata.description}</h3>
              </span>
            </span>

            <footer className='right-bottom  absolute bottom-2 px-1 flex justify-between w-full lg:text-4xl font-thin '>
              <span>
                <span className='time ml-4'>{currentDateTime.date}</span> <br />
                <span className='day-time text-lg font-thin flex gap-2 ml-6'>  <span>{currentDateTime.dayName}</span>
                  <span>{currentDateTime.time}</span>
                </span>
              </span>
              <span className='lg:text-5xl font-thin mr-4'>{wetherdata.temperature}°<span className='lg:text-4xl font-thin'>c</span></span>

            </footer>
          </div>

          {/* right side */}

          <div className="right   w-80 h-full   bg-black  bg-opacity-80 flex flex-col gap-6 pt-8 rounded-r-3xl">
            <div className="top h-1/4 w-auto  text-4xl font-bold font-sans "><img className='h-full mx-auto' src={wetherdata.icon} alt="weather icon" /></div>

            <input placeholder='Enter city' onKeyDown={handleKeyPress} ref={inputRef} className=' mx-auto pl-2 rounded-lg shadow-lg shadow-blue-400 text-gray-800 font-sans font-bold w-5/6 ' type="text" value={searchquery} onChange={(e) => setsearchquery(e.target.value)}
            />

            <div className="list">
              <ul className='flex justify-between flex-col gap-4 font-sherif w-5/6 mx-auto text-center'>
                <li className='rounded-md border-2 border-blue-300  shadow-md shadow-blue-400'>Humidity &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {wetherdata.humidity}</li>
                <li className='rounded-md border-2 border-blue-300  shadow-md shadow-blue-400'>Sunrise &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  &nbsp; {wetherdata.sunrise}</li>
                <li className='rounded-md border-2 border-blue-300  shadow-md shadow-blue-400'>Sunset &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  &nbsp;{wetherdata.sunset}</li>
                <li className='rounded-md border-2 border-blue-300  shadow-md shadow-blue-400 '>Sea level &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;{wetherdata.sealevel}</li>
              </ul>
            </div>

          </div>
        </div> 
        
     
        </div>
    </div>

  )
}

export default App



