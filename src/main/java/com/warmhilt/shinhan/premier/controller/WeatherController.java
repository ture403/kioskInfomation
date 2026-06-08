package com.warmhilt.shinhan.premier.controller;

import com.warmhilt.shinhan.premier.common.dto.ApiResponse;
import com.warmhilt.shinhan.premier.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/weather")
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    @GetMapping
    public ApiResponse<Map<String, String>> getWeather() {
        log.info("📥 [WeatherController] 클라이언트 날씨 API 요청 수신");
        
        Map<String, String> weatherData = weatherService.getCurrentWeather();
        
        log.info("📤 [WeatherController] 클라이언트로 반환할 날씨 데이터: {}", weatherData);
        return ApiResponse.success(weatherData);
    }

    @GetMapping("/search")
    public ApiResponse<java.util.List<String>> searchAddresses(@org.springframework.web.bind.annotation.RequestParam("query") String query) {
        log.info("📥 [WeatherController] 주소 검색 요청 수신: {}", query);
        java.util.List<String> results = weatherService.searchAddresses(query);
        return ApiResponse.success(results);
    }
}
