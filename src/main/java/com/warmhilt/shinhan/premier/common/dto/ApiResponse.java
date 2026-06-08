package com.warmhilt.shinhan.premier.common.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Builder;
import lombok.Getter;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import java.time.LocalDateTime;

@Getter
@Builder
public class ApiResponse<T> {
    public static final int RES_SUCCESS = 0;

    private int code;
    
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime timestamp;
    
    private String message;
    private T response;
    private String path;

    public static <T> ApiResponse<T> success(T response) {
        return ApiResponse.<T>builder()
                .code(RES_SUCCESS)
                .timestamp(LocalDateTime.now())
                .message("성공")
                .response(response)
                .path(getCurrentRequestPath())
                .build();
    }

    public static <T> ApiResponse<T> error(int code, String message) {
        return ApiResponse.<T>builder()
                .code(code)
                .timestamp(LocalDateTime.now())
                .message(message)
                .response(null)
                .path(getCurrentRequestPath())
                .build();
    }

    private static String getCurrentRequestPath() {
        try {
            ServletRequestAttributes attrs = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attrs != null && attrs.getRequest() != null) {
                return attrs.getRequest().getRequestURI();
            }
        } catch (Exception e) {
            // ignore
        }
        return "";
    }
}
