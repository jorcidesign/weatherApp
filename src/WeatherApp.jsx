import React from "react";
import "./WeatherApp.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import image from "./assets/cloud.png";
import { useState, useEffect } from "react";
import axios from "axios";

const WeatherApp = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const API_KEY = import.meta.env.VITE_API_KEY;

  const [isCelsius, setIsCelsius] = useState(true);
  function kelvinToCelsius(kelvin) {
    return (kelvin - 273.15).toFixed(1);
  }


  const changeToFarenheit = (celsius) => {
    return ((celsius * 9) / 5 + 32).toFixed(1);
  };


  const getLocation = () => {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            resolve({ latitude, longitude });
          },
          (error) => {
            reject(new Error("Error obteniendo la ubicación."));
          }
        );
      } else {
        reject(
          new Error("La geolocalización no es compatible en este navegador.")
        );
      }
    });
  };

  const [weather, setWeather] = useState({});
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { latitude, longitude } = await getLocation();

        const apiURLCompleted = `${API_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}`;

        const response = await axios.get(apiURLCompleted);
        setWeather(response.data);
        setIsLoading(false);
      } catch (error) {
        setError(error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Render Condicional
  if (isLoading) {
    return <div>Cargando datos...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  //   const data = JSON.parse(weather);

  return (
    <div className="card">
      <div className="card-head">
        <div className="card-headContainer">
          <FontAwesomeIcon className="locationIcon " icon={faLocationDot} />
          <div className="weather-ubication">
            <span className="ubication-text">{weather.name}</span>
          </div>
          <FontAwesomeIcon className="arrowIcon" icon={faChevronRight} />
        </div>
      </div>
      <div className="card-intern">
        <div className="card-image">
          <img src={image} alt="" />
        </div>
        <div className="weather">
          <div className="weather-name">
            <h2>{weather["weather"][0]["description"]}</h2>
          </div>
          <div className="weather-conditions">
            <h3>Air Conditions</h3>
            <table>
              <tbody>
                <tr>
                  <td className="condition-type">Wind Speed:</td>
                  <td className="condition-value">
                    {weather["wind"]["speed"]} m/s
                  </td>
                </tr>
                <tr>
                  <td className="condition-type">Clouds:</td>
                  <td className="condition-value">
                    {weather["clouds"]["all"]}%
                  </td>
                </tr>
                <tr>
                  <td className="condition-type">Pressure:</td>
                  <td className="condition-value">
                    {weather["main"]["pressure"]} Ph
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="weather-temp">
            <h1>
              {isCelsius
                ? kelvinToCelsius(weather["main"]["temp"]) + " °C"
                : changeToFarenheit(kelvinToCelsius(weather["main"]["temp"])) +
                  " °F"}
            </h1>
          </div>
          <div className="weather-changeTempButton">
            <button
              onClick={() => {
                setIsCelsius(!isCelsius);
              }}
            >
            {isCelsius 
            ? "Change to °F"
            : "Change to °C"
            }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherApp;
