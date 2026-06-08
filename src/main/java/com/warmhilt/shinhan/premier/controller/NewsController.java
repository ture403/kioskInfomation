package com.warmhilt.shinhan.premier.controller;

import com.warmhilt.shinhan.premier.common.dto.ApiResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    @GetMapping
    public ApiResponse<List<String>> getNewsHeadlines(@RequestParam(defaultValue = "경제") String category) {
        String rssUrl;
        try {
            switch (category) {
                case "종합":
                case "일반":
                    rssUrl = "https://news.google.com/rss?hl=ko&gl=KR&ceid=KR:ko";
                    break;
                case "경제":
                    rssUrl = "https://news.google.com/rss/headlines/section/topic/BUSINESS?hl=ko&gl=KR&ceid=KR:ko";
                    break;
                case "IT":
                case "과학":
                case "IT/과학":
                    rssUrl = "https://news.google.com/rss/headlines/section/topic/TECHNOLOGY?hl=ko&gl=KR&ceid=KR:ko";
                    break;
                case "스포츠":
                    rssUrl = "https://news.google.com/rss/headlines/section/topic/SPORTS?hl=ko&gl=KR&ceid=KR:ko";
                    break;
                default:
                    // 부동산, 주식, 환율 등 특정 키워드 검색
                    String encodedCategory = URLEncoder.encode(category, StandardCharsets.UTF_8.toString());
                    rssUrl = "https://news.google.com/rss/search?q=" + encodedCategory + "&hl=ko&gl=KR&ceid=KR:ko";
                    break;
            }

            List<String> headlines = new ArrayList<>();
            URL url = new URL(rssUrl);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)");
            conn.setConnectTimeout(5000);
            conn.setReadTimeout(5000);

            InputStream is = conn.getInputStream();
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            // XML 보안 설정 (XXE 방지)
            factory.setFeature("http://apache.org/xml/features/disallow-doctype-decl", true);
            
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse(is);

            NodeList items = doc.getElementsByTagName("item");
            // 최대 15개 추출
            for (int i = 0; i < Math.min(items.getLength(), 15); i++) {
                Element item = (Element) items.item(i);
                String title = item.getElementsByTagName("title").item(0).getTextContent();
                // 구글 뉴스 타이틀에서 '- 언론사명' 제거
                if (title.lastIndexOf(" - ") > 0) {
                    title = title.substring(0, title.lastIndexOf(" - "));
                }
                headlines.add(title);
            }
            is.close();
            
            return ApiResponse.success(headlines);

        } catch (Exception e) {
            e.printStackTrace();
            return ApiResponse.error(500, "뉴스 데이터를 가져오는 데 실패했습니다: " + e.getMessage());
        }
    }
}
