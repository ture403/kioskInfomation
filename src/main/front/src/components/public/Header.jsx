import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import { fetchApi } from "../../utils/api";

dayjs.locale("ko");

function Header() {
  const [currentTime, setCurrentTime] = useState("");
  const [weather, setWeather] = useState({ temperature: "-", skyCode: "", ptyCode: "" });

  useEffect(() => {
    const updateTime = () => {
      setCurrentTime(dayjs().format("YYYY. MM. DD A hh:mm"));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const res = await fetchApi("/api/weather");
        if (res && res.response && res.response.temperature) {
          setWeather(res.response);
        }
      } catch (error) {
        console.error("Failed to fetch weather", error);
      }
    };

    loadWeather();
    // 40분마다 날씨 정보 갱신
    const weatherTimer = setInterval(loadWeather, 40 * 60 * 1000);
    return () => clearInterval(weatherTimer);
  }, []);

  // 백엔드에서 넘겨준 코드를 프론트엔드에서 아이콘(이미지)으로 변환
  const getWeatherIcon = (sky, pty) => {
    if (!sky && !pty) return null;

    if (pty && pty !== "0") {
      if (pty === "1" || pty === "5") return <i className="ico-wt-rainy"></i>;
      if (pty === "2" || pty === "6") return <i className="ico-wt-sleet"></i>;
      if (pty === "3" || pty === "7") return <i className="ico-wt-snowy"></i>;
      if (pty === "4") return <i className="ico-wt-shower"></i>;
    }

    if (sky === "1") return <i className="ico-wt-sunny"></i>;
    if (sky === "3") return <i className="ico-wt-cloud-ss"></i>;
    if (sky === "4") return <i className="ico-wt-cloud"></i>;

    return null;
  };

  return (
    <header className="public-header">
      <div className="logo-area"></div>
      <div className="header-info">
        <span className="date-time">{currentTime}</span>
        {weather.temperature !== "-" && (
          <div className="weather-info">
            <span className="weather-icon">{getWeatherIcon(weather.skyCode, weather.ptyCode)}</span>
            <span className="temperature">{weather.temperature}°</span>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
