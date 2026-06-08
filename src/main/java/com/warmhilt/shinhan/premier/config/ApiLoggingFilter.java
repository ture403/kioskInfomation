package com.warmhilt.shinhan.premier.config;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
public class ApiLoggingFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        long startTime = System.currentTimeMillis();
        String uri = request.getRequestURI();
        String method = request.getMethod();

        // /api 경로로 들어오는 요청만 로깅하여 정적 리소스(JS, CSS 등) 로깅으로 인한 노이즈 방지
        boolean isApi = uri.startsWith("/api");

        if (isApi) {
            log.info("▶️ [API REQUEST] {} {}", method, uri);
        }

        try {
            filterChain.doFilter(request, response);
        } finally {
            if (isApi) {
                long duration = System.currentTimeMillis() - startTime;
                log.info("◀️ [API RESPONSE] {} {} - Status: {} ({}ms)", method, uri, response.getStatus(), duration);
            }
        }
    }
}
