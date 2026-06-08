package com.warmhilt.shinhan.premier.controller;

import com.warmhilt.shinhan.premier.common.dto.ApiResponse;
import com.warmhilt.shinhan.premier.common.dto.CommonInfoDto;
import com.warmhilt.shinhan.premier.entity.CommonInfo;
import com.warmhilt.shinhan.premier.service.CommonInfoService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/common-info")
public class CommonInfoController {

    private final CommonInfoService service;

    public CommonInfoController(CommonInfoService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<CommonInfo> getCommonInfo() {
        return ApiResponse.success(service.getCommonInfo());
    }

    @PostMapping
    public ApiResponse<CommonInfo> saveCommonInfo(@RequestBody CommonInfoDto dto) {
        return ApiResponse.success(service.saveOrUpdate(dto));
    }
}
