package com.warmhilt.shinhan.premier.controller;

import com.warmhilt.shinhan.premier.entity.Admin;
import com.warmhilt.shinhan.premier.repository.AdminRepository;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.warmhilt.shinhan.premier.common.dto.ApiResponse;
import com.warmhilt.shinhan.premier.common.util.PasswordUtil;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminRepository adminRepository;

    @PostConstruct
    public void init() {
        if (adminRepository.count() == 0) {
            Admin admin = new Admin();
            admin.setUsername("admin");
            admin.setPassword(PasswordUtil.encryptPassword("admin1234")); // 비밀번호 암호화 저장
            adminRepository.save(admin);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginData, HttpServletRequest request) {
        String username = loginData.get("id");
        String password = loginData.get("password");

        Optional<Admin> adminOpt = adminRepository.findByUsername(username);

        // 입력받은 평문 비밀번호를 암호화한 뒤, DB에 저장된 암호화된 비밀번호와 일치하는지 비교
        if (adminOpt.isPresent() && adminOpt.get().getPassword().equals(PasswordUtil.encryptPassword(password))) {
            Admin admin = adminOpt.get();
            admin.setLastLoginTime(LocalDateTime.now());
            adminRepository.save(admin);
            
            HttpSession session = request.getSession(true);
            session.setAttribute("admin", username);
            session.setMaxInactiveInterval(1800); // 30분 세션
            
            log.info("관리자 로그인 성공: [{}] - 로그인 시간: {}", username, admin.getLastLoginTime());
            return ResponseEntity.ok(ApiResponse.success(Map.of("admin", username)));
        }

        log.warn("관리자 로그인 실패: [{}] - 잘못된 자격 증명", username);
        return ResponseEntity.ok(ApiResponse.error(401, "Invalid credentials"));
    }

    @PostMapping("/create")
    public ResponseEntity<?> createAdmin(@RequestBody Map<String, String> adminData) {
        String username = adminData.get("id");
        String password = adminData.get("password");

        if (adminRepository.findByUsername(username).isPresent()) {
            return ResponseEntity.ok(ApiResponse.error(400, "이미 존재하는 아이디입니다."));
        }

        Admin admin = new Admin();
        admin.setUsername(username);
        admin.setPassword(PasswordUtil.encryptPassword(password));
        adminRepository.save(admin);

        log.info("새로운 관리자 계정 생성 성공: [{}]", username);
        return ResponseEntity.ok(ApiResponse.success(Map.of("admin", username)));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @GetMapping("/check")
    public ResponseEntity<?> checkSession(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        if (session != null && session.getAttribute("admin") != null) {
            return ResponseEntity.ok(ApiResponse.success(null));
        }
        return ResponseEntity.ok(ApiResponse.error(401, "No valid session"));
    }
}
