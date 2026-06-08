package com.warmhilt.shinhan.premier.controller;

import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.http.HttpStatus;
import jakarta.servlet.RequestDispatcher;
import jakarta.servlet.http.HttpServletRequest;

@Controller
public class CustomErrorController implements ErrorController {

    @RequestMapping("/error")
    public String handleError(HttpServletRequest request) {
        Object status = request.getAttribute(RequestDispatcher.ERROR_STATUS_CODE);
        
        if (status != null) {
            Integer statusCode = Integer.valueOf(status.toString());
            // 404 Not Found 에러인 경우 React Router 처리를 위해 index.html로 포워딩
            if (statusCode == HttpStatus.NOT_FOUND.value()) {
                return "forward:/index.html";
            }
        }
        
        return "error";
    }
}
