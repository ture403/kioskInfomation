package com.warmhilt.shinhan.premier.service;

import com.warmhilt.shinhan.premier.entity.StoreInfo;
import com.warmhilt.shinhan.premier.repository.StoreInfoRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@Service
public class StoreInfoService {

    private final StoreInfoRepository repository;
    private final String UPLOAD_DIR = "C:/Premier/img/";

    public StoreInfoService(StoreInfoRepository repository) {
        this.repository = repository;
        File dir = new File(UPLOAD_DIR);
        if (!dir.exists()) {
            dir.mkdirs();
        }
    }

    public List<StoreInfo> getAllStores() {
        return repository.findAll();
    }

    public StoreInfo getStoreById(Long id) {
        return repository.findById(id).orElse(null);
    }

    public StoreInfo createStore(StoreInfo store, MultipartFile mainCard, MultipartFile detailMain, MultipartFile storeGuide, MultipartFile bottomEvent) throws IOException {
        if (mainCard != null && !mainCard.isEmpty()) {
            store.setMainCardImage(saveFile(mainCard));
        }
        if (detailMain != null && !detailMain.isEmpty()) {
            store.setDetailMainImage(saveFile(detailMain));
        }
        if (storeGuide != null && !storeGuide.isEmpty()) {
            store.setStoreGuideImage(saveFile(storeGuide));
        }
        if (bottomEvent != null && !bottomEvent.isEmpty()) {
            store.setBottomEventBanner(saveFile(bottomEvent));
        }
        return repository.save(store);
    }

    public StoreInfo updateStore(Long id, StoreInfo updatedStore, MultipartFile mainCard, MultipartFile detailMain, MultipartFile storeGuide, MultipartFile bottomEvent) throws IOException {
        StoreInfo existing = repository.findById(id).orElseThrow(() -> new RuntimeException("Store not found"));

        existing.setName(updatedStore.getName());
        existing.setDescription(updatedStore.getDescription());
        existing.setCategory(updatedStore.getCategory());
        existing.setFloor(updatedStore.getFloor());
        existing.setPhone(updatedStore.getPhone());
        existing.setOperationHours1(updatedStore.getOperationHours1());
        existing.setOperationHours2(updatedStore.getOperationHours2());
        existing.setParkingTitle(updatedStore.getParkingTitle());
        existing.setParkingDetail(updatedStore.getParkingDetail());

        if (updatedStore.getDeletedImages() != null) {
            if (updatedStore.getDeletedImages().contains("mainCardImage")) existing.setMainCardImage(null);
            if (updatedStore.getDeletedImages().contains("detailMainImage")) existing.setDetailMainImage(null);
            if (updatedStore.getDeletedImages().contains("storeGuideImage")) existing.setStoreGuideImage(null);
            if (updatedStore.getDeletedImages().contains("bottomEventBanner")) existing.setBottomEventBanner(null);
        }

        if (mainCard != null && !mainCard.isEmpty()) {
            existing.setMainCardImage(saveFile(mainCard));
        }
        if (detailMain != null && !detailMain.isEmpty()) {
            existing.setDetailMainImage(saveFile(detailMain));
        }
        if (storeGuide != null && !storeGuide.isEmpty()) {
            existing.setStoreGuideImage(saveFile(storeGuide));
        }
        if (bottomEvent != null && !bottomEvent.isEmpty()) {
            existing.setBottomEventBanner(saveFile(bottomEvent));
        }

        return repository.save(existing);
    }

    public void deleteStore(Long id) {
        repository.deleteById(id);
    }

    private String saveFile(MultipartFile file) throws IOException {
        String originalName = file.getOriginalFilename();
        String extension = "";
        if (originalName != null && originalName.contains(".")) {
            extension = originalName.substring(originalName.lastIndexOf("."));
        }
        String fileName = UUID.randomUUID().toString() + extension;
        Path filePath = Paths.get(UPLOAD_DIR + fileName);
        Files.write(filePath, file.getBytes());
        return "/img/" + fileName;
    }
}
