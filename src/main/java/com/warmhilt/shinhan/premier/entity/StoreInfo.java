package com.warmhilt.shinhan.premier.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "store_info")
public class StoreInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    
    @Column(length = 2000)
    private String description;
    
    private String category;
    private String floor;
    private String phone;
    
    private String operationHours1;
    private String operationHours2;
    
    private String parkingTitle;
    
    @Column(length = 1000)
    private String parkingDetail;
    
    private String mainCardImage;
    private String detailMainImage;
    private String storeGuideImage;
    private String bottomEventBanner;

    private LocalDateTime registeredDate;
    private LocalDateTime updatedDate;

    @Transient
    private java.util.List<String> deletedImages;

    @PrePersist
    protected void onCreate() {
        registeredDate = LocalDateTime.now();
        updatedDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedDate = LocalDateTime.now();
    }
}
