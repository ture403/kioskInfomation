package com.warmhilt.shinhan.premier.service;

import com.warmhilt.shinhan.premier.common.dto.CommonInfoDto;
import com.warmhilt.shinhan.premier.entity.CommonInfo;
import com.warmhilt.shinhan.premier.repository.CommonInfoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommonInfoService {

    private final CommonInfoRepository repository;

    public CommonInfoService(CommonInfoRepository repository) {
        this.repository = repository;
    }

    public CommonInfo getCommonInfo() {
        List<CommonInfo> list = repository.findAll();
        if (list.isEmpty()) {
            return new CommonInfo(); // return empty obj to avoid null
        }
        return list.get(0);
    }

    public CommonInfo saveOrUpdate(CommonInfoDto dto) {
        List<CommonInfo> list = repository.findAll();
        CommonInfo info;
        if (list.isEmpty()) {
            info = new CommonInfo();
        } else {
            info = list.get(0);
        }
        
        info.setAddress(dto.getAddress());
        info.setTextTicker(dto.getTextTicker());
        info.setBuildingInfo(dto.getBuildingInfo());
        
        return repository.save(info);
    }
}
