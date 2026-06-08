package com.warmhilt.shinhan.premier.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.warmhilt.shinhan.premier.common.dto.ApiResponse;
import com.warmhilt.shinhan.premier.entity.StoreInfo;
import com.warmhilt.shinhan.premier.service.StoreInfoService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/stores")
public class StoreInfoController {

    private final StoreInfoService service;

    public StoreInfoController(StoreInfoService service) {
        this.service = service;
    }

    @GetMapping
    public ApiResponse<List<StoreInfo>> getAllStores() {
        return ApiResponse.success(service.getAllStores());
    }

    @GetMapping("/{id}")
    public ApiResponse<StoreInfo> getStoreById(@PathVariable Long id) {
        return ApiResponse.success(service.getStoreById(id));
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<StoreInfo> createStore(
            @RequestPart("store") String storeJson,
            @RequestPart(value = "mainCardImage", required = false) MultipartFile mainCard,
            @RequestPart(value = "detailMainImage", required = false) MultipartFile detailMain,
            @RequestPart(value = "storeGuideImage", required = false) MultipartFile storeGuide,
            @RequestPart(value = "bottomEventBanner", required = false) MultipartFile bottomEvent) throws IOException {
        
        ObjectMapper mapper = new ObjectMapper();
        StoreInfo store = mapper.readValue(storeJson, StoreInfo.class);
        
        return ApiResponse.success(service.createStore(store, mainCard, detailMain, storeGuide, bottomEvent));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<StoreInfo> updateStore(
            @PathVariable Long id,
            @RequestPart("store") String storeJson,
            @RequestPart(value = "mainCardImage", required = false) MultipartFile mainCard,
            @RequestPart(value = "detailMainImage", required = false) MultipartFile detailMain,
            @RequestPart(value = "storeGuideImage", required = false) MultipartFile storeGuide,
            @RequestPart(value = "bottomEventBanner", required = false) MultipartFile bottomEvent) throws IOException {
        
        ObjectMapper mapper = new ObjectMapper();
        StoreInfo store = mapper.readValue(storeJson, StoreInfo.class);
        
        return ApiResponse.success(service.updateStore(id, store, mainCard, detailMain, storeGuide, bottomEvent));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteStore(@PathVariable Long id) {
        service.deleteStore(id);
        return ApiResponse.success(null);
    }
}
