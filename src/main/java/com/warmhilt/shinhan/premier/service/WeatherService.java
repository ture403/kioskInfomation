package com.warmhilt.shinhan.premier.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.annotation.PostConstruct;
import java.net.URI;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.List;
import java.util.Collections;
import java.util.stream.Collectors;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class WeatherService {

    @Value("${weather.api.key:}")
    private String apiKey;

    @Value("${weather.api.nx:60}")
    private String defaultNx;

    @Value("${weather.api.ny:127}")
    private String defaultNy;

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final CommonInfoService commonInfoService;
    
    private final Map<String, int[]> coordinateMap = new HashMap<>();

    public WeatherService(CommonInfoService commonInfoService) {
        this.commonInfoService = commonInfoService;
    }

    @PostConstruct
    public void init() {
        try {
            ClassPathResource resource = new ClassPathResource("data/coordinate_code.json");
            JsonNode root = objectMapper.readTree(resource.getInputStream());
            for (JsonNode node : root) {
                String step1 = node.path("step1").asText("").trim();
                String step2 = node.path("step2").asText("").trim();
                String step3 = node.path("step3").asText("").trim();
                int nx = node.path("nx").asInt();
                int ny = node.path("ny").asInt();

                StringBuilder key = new StringBuilder(step1);
                if (!step2.isEmpty()) key.append(" ").append(step2);
                if (!step3.isEmpty()) key.append(" ").append(step3);

                coordinateMap.put(key.toString(), new int[]{nx, ny});
            }
            log.info("📍 날씨 API용 좌표 데이터 로드 완료 (총 {}개)", coordinateMap.size());
        } catch (Exception e) {
            log.error("❌ 좌표 데이터(coordinate_code.json) 로드 실패", e);
        }
    }

    public List<String> searchAddresses(String query) {
        if (query == null || query.trim().isEmpty()) {
            return Collections.emptyList();
        }
        String normalizedQuery = query.trim();
        return coordinateMap.keySet().stream()
                .filter(key -> key.contains(normalizedQuery))
                .sorted()
                .limit(10)
                .collect(Collectors.toList());
    }

    private String normalizeRegion(String address) {
        if (address == null) return "";
        String[] parts = address.trim().split("\\s+");
        if (parts.length == 0) return address;

        String region = parts[0];
        if (region.equals("서울") || region.equals("서울시")) parts[0] = "서울특별시";
        else if (region.equals("부산") || region.equals("부산시")) parts[0] = "부산광역시";
        else if (region.equals("대구") || region.equals("대구시")) parts[0] = "대구광역시";
        else if (region.equals("인천") || region.equals("인천시")) parts[0] = "인천광역시";
        else if (region.equals("광주") || region.equals("광주시")) parts[0] = "광주광역시";
        else if (region.equals("대전") || region.equals("대전시")) parts[0] = "대전광역시";
        else if (region.equals("울산") || region.equals("울산시")) parts[0] = "울산광역시";
        else if (region.equals("세종") || region.equals("세종시")) parts[0] = "세종특별자치시";
        else if (region.equals("경기")) parts[0] = "경기도";
        else if (region.equals("강원") || region.equals("강원도")) parts[0] = "강원특별자치도";
        else if (region.equals("충북")) parts[0] = "충청북도";
        else if (region.equals("충남")) parts[0] = "충청남도";
        else if (region.equals("전북") || region.equals("전북도")) parts[0] = "전북특별자치도";
        else if (region.equals("전남")) parts[0] = "전라남도";
        else if (region.equals("경북")) parts[0] = "경상북도";
        else if (region.equals("경남")) parts[0] = "경상남도";
        else if (region.equals("제주") || region.equals("제주시") || region.equals("제주도")) parts[0] = "제주특별자치도";

        return String.join(" ", parts);
    }

    public Map<String, String> getCurrentWeather() {
        Map<String, String> result = new HashMap<>();
        result.put("temperature", "-");
        result.put("skyCode", "");
        result.put("ptyCode", "");

        if (apiKey == null || apiKey.trim().isEmpty()) {
            return result;
        }

        try {
            LocalDateTime now = LocalDateTime.now();
            if (now.getMinute() < 45) {
                now = now.minusHours(1);
            }
            String baseDate = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
            String baseTime = now.format(DateTimeFormatter.ofPattern("HH")) + "30";

            String targetNx = this.defaultNx;
            String targetNy = this.defaultNy;

            try {
                String rawAddress = commonInfoService.getCommonInfo().getAddress();
                if (rawAddress != null && !rawAddress.trim().isEmpty()) {
                    String address = normalizeRegion(rawAddress);
                    String[] parts = address.split("\\s+");
                    if (parts.length >= 3) {
                        String key3 = parts[0] + " " + parts[1] + " " + parts[2];
                        String key2 = parts[0] + " " + parts[1];
                        
                        if (coordinateMap.containsKey(key3)) {
                            targetNx = String.valueOf(coordinateMap.get(key3)[0]);
                            targetNy = String.valueOf(coordinateMap.get(key3)[1]);
                            log.info("📍 주소 기반 좌표 매핑 성공 (3단계): {} -> nx:{}, ny:{}", key3, targetNx, targetNy);
                        } else if (coordinateMap.containsKey(key2)) {
                            targetNx = String.valueOf(coordinateMap.get(key2)[0]);
                            targetNy = String.valueOf(coordinateMap.get(key2)[1]);
                            log.info("📍 주소 기반 좌표 매핑 성공 (2단계): {} -> nx:{}, ny:{}", key2, targetNx, targetNy);
                        }
                    } else if (parts.length == 2) {
                        String key2 = parts[0] + " " + parts[1];
                        if (coordinateMap.containsKey(key2)) {
                            targetNx = String.valueOf(coordinateMap.get(key2)[0]);
                            targetNy = String.valueOf(coordinateMap.get(key2)[1]);
                            log.info("📍 주소 기반 좌표 매핑 성공 (2단계): {} -> nx:{}, ny:{}", key2, targetNx, targetNy);
                        }
                    } else if (parts.length == 1) {
                        String key1 = parts[0];
                        if (coordinateMap.containsKey(key1)) {
                            targetNx = String.valueOf(coordinateMap.get(key1)[0]);
                            targetNy = String.valueOf(coordinateMap.get(key1)[1]);
                            log.info("📍 주소 기반 좌표 매핑 성공 (1단계): {} -> nx:{}, ny:{}", key1, targetNx, targetNy);
                        }
                    }
                }
            } catch (Exception e) {
                log.warn("⚠️ 주소 기반 좌표 매핑 실패, 기본값 사용: {}", e.getMessage());
            }

            URI uri = UriComponentsBuilder.fromHttpUrl("http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst")
                    .queryParam("serviceKey", apiKey)
                    .queryParam("pageNo", "1")
                    .queryParam("numOfRows", "60")
                    .queryParam("dataType", "JSON")
                    .queryParam("base_date", baseDate)
                    .queryParam("base_time", baseTime)
                    .queryParam("nx", targetNx)
                    .queryParam("ny", targetNy)
                    .build(true)
                    .toUri();

            log.info("📡 기상청 초단기예보 API 호출 URL 생성 완료 (기준시간: {} {})", baseDate, baseTime);

            String response = restTemplate.getForObject(uri, String.class);
            log.info("📡 기상청 API 원본 응답 데이터: {}", response);

            if (response == null || !response.contains("\"item\"")) {
                return result;
            }

            JsonNode root = objectMapper.readTree(response);
            JsonNode items = root.path("response").path("body").path("items").path("item");

            String t1h = "-";
            String sky = "";
            String pty = "";

            boolean t1hFound = false;
            boolean skyFound = false;
            boolean ptyFound = false;

            if (items.isArray()) {
                for (JsonNode item : items) {
                    String category = item.path("category").asText();
                    String value = item.path("obsrValue").asText(item.path("fcstValue").asText(""));
                    
                    if (!t1hFound && "T1H".equals(category)) {
                        t1h = value;
                        t1hFound = true;
                    } else if (!skyFound && "SKY".equals(category)) {
                        sky = value;
                        skyFound = true;
                    } else if (!ptyFound && "PTY".equals(category)) {
                        pty = value;
                        ptyFound = true;
                    }
                }
            }

            result.put("temperature", t1h);
            result.put("skyCode", sky);
            result.put("ptyCode", pty);

            log.info("🌤️ 기상청 실시간 날씨 파싱 완료 (지역: nx={}, ny={}) - 기온: {}도, SKY: {}, PTY: {}", targetNx, targetNy, t1h, sky, pty);

        } catch (Exception e) {
            log.error("❌ 기상청 날씨 API 호출 중 오류 발생: {}", e.getMessage(), e);
        }

        return result;
    }
}
