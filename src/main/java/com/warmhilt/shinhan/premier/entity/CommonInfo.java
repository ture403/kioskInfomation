package com.warmhilt.shinhan.premier.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Table(name = "common_info")
public class CommonInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String address;
    private String textTicker;
    
    @Column(length = 2000)
    private String buildingInfo;

    private LocalDateTime registeredDate;
    private LocalDateTime updatedDate;

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
