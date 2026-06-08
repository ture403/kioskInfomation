package com.warmhilt.shinhan.premier.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Slf4j
@Component
public class AdminAuthInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // 1. GET (조회) 및 OPTIONS (CORS 사전 요청)은 무조건 통과시킴 (퍼블릭용)
        if (HttpMethod.GET.matches(request.getMethod()) || HttpMethod.OPTIONS.matches(request.getMethod())) {
            return true;
        }

        String path = request.getRequestURI();

        // 2. 관리자 로그인/로그아웃 및 계정 생성 관련 POST API는 세션이 없어도 통과
        if (path.startsWith("/api/admin/login") || path.startsWith("/api/admin/logout") || path.startsWith("/api/admin/create")) {
            return true;
        }

        // 3. 그 외 데이터를 조작하는 API (POST, PUT, DELETE) 접근 시 세션 필수 검사
        HttpSession session = request.getSession(false);
        if (session == null || session.getAttribute("admin") == null) {
            log.warn("🚨 보안 경고: 무단 API 접근 시도 차단! [HTTP {}] 요청 경로: {}", request.getMethod(), path);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"success\":false,\"error\":{\"code\":401,\"message\":\"Unauthorized: 관리자 로그인이 필요합니다.\"}}");
            return false; // 요청 진행 중단
        }

        return true; // 세션이 존재하면 요청 허용
    }
}
