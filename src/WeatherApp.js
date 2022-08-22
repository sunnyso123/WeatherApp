import React, { useState, useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import { ThemeProvider } from "@emotion/react";
import sunriseAndSunsetData from './sunrise-sunset.json';
import WeatherCard from "./WeatherCard";
import useWeatherApi from "./useWeatherApi";

const theme = {
  light: {
    backgroundColor: '#ededed',
    foregroundColor: '#f9f9f9',
    boxShadow: '0 1px 3px 0 #999999',
    titleColor: '#212121',
    temperatureColor: '#757575',
    textColor: '#828282',
  },
  dark: {
    backgroundColor: '#1F2022',
    foregroundColor: '#121416',
    boxShadow:
      '0 1px 4px 0 rgba(12, 12, 13, 0.2), 0 0 0 1px rgba(0, 0, 0, 0.15)',
    titleColor: '#f9f9fa',
    temperatureColor: '#dddddd',
    textColor: '#cccccc',
  },
};

const Container = styled.div`
    background-color: ${({ theme }) => theme.backgroundColor};
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const getMoment = (locationName) => {
  const location = sunriseAndSunsetData.find(
    (data) => data.locationName === locationName
  );

  if(!location) return null;

  const now = new Date();

  const nowDate = Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now).replace(/\//g, '-');

  const locationDate = location.time && location.time.find((time) => time.dataTime === nowDate);

  const sunriseTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunrise}`
  ).getTime();
  const sunsetTimestamp = new Date(
    `${locationDate.dataTime} ${locationDate.sunset}`
  ).getTime();
  const nowTimestamp = now.getTime();

  return sunriseTimestamp <= nowTimestamp && nowTimestamp <= sunsetTimestamp ? 'day' : 'night';
};

const WeatherApp = () => {
  const [weatherElement, fetchData] = useWeatherApi();
  const [currentTheme, setCurrentTheme] = useState('light');
  const { locationName } = weatherElement;

  const moment = useMemo(() => getMoment(locationName), [locationName]);

  useEffect(() => {setCurrentTheme(moment === 'day' ? 'light' : 'dark')}, [moment]);

  return (
    <ThemeProvider theme={theme[currentTheme]}>
        <Container>
            <WeatherCard 
              weatherElement={weatherElement}
              moment={moment}
              fetchData={fetchData}
            />
        </Container>
    </ThemeProvider>
  );
};

export default WeatherApp;