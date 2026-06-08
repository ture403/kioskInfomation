import React, { useState, useEffect } from 'react';
import { fetchApi } from '../../utils/api';
import '../../assets/styles/public.css';

function StoreDetail({ storeId, onBack }) {
  const [store, setStore] = useState(null);

  useEffect(() => {
    const loadStore = async () => {
      try {
        const res = await fetchApi(`/api/stores/${storeId}`);
        if (res && res.response) {
          setStore(res.response);
        }
      } catch (err) {
        console.error("Failed to fetch store details", err);
      }
    };
    if (storeId) {
      loadStore();
    }
  }, [storeId]);

  // 1분(60초) 동안 상호작용(터치, 클릭, 스크롤)이 없으면 자동 뒤로가기
  useEffect(() => {
    let timeoutId;

    const resetTimer = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        onBack();
      }, 60000); // 60초
    };

    // 초기 타이머 구동
    resetTimer();

    // 터치, 마우스 움직임, 클릭, 스크롤 등의 이벤트를 감지하여 타이머 리셋
    const events = ['touchstart', 'mousemove', 'click', 'scroll'];
    events.forEach(evt => window.addEventListener(evt, resetTimer, true));

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(evt => window.removeEventListener(evt, resetTimer, true));
    };
  }, [onBack]);

  if (!store) return <div className="store-detail-loading">로딩 중...</div>;

  return (
    <div className="store-detail-container">
      {/* Top Banner with detailMainImage, Name, Description, and Back Button */}
      <div
        className="store-detail-hero"
        style={{ backgroundImage: store.detailMainImage && store.detailMainImage !== "null" && store.detailMainImage.trim() !== "" ? `url(${store.detailMainImage})` : 'none' }}
      >
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="store-name">{store.name}</h1>
          <p className="store-desc">{store.description}</p>
        </div>
        <button className="detail-btn" onClick={onBack}>
          <i className="ico-back"></i>
          <span>돌아가기</span>
        </button>
      </div>

      {/* Middle Card: Info & Guide Image */}
      <div className="store-info-card">
        <div className="info-section">
          <div className="info-list">
            <div className="info-row">
              <div className="info-item inline-item">
                <i className="ico-type"></i> {store.category || "업종"}
              </div>
              <div className="info-item inline-item">
                <i className="ico-map"></i> {store.floor || "층수"}
              </div>
            </div>
            <div className="info-item t-way">
              <i className="ico-time"></i>
              <div className="info-item-time">
                <p>
                  {store.operationHours1}
                </p>
                <p>
                  {store.operationHours2 ? `  ${store.operationHours2}` : ''}
                </p>
              </div>
            </div>
            <div className="info-item">
              <i className="ico-call"></i> {store.phone}
            </div>
          </div>
          <div className="guide-image-container">
            {store.storeGuideImage ? (
              <img src={store.storeGuideImage} alt="Store Guide" className="guide-image" />
            ) : (
              ''
            )}
          </div>
        </div>
        {(store.parkingTitle || store.parkingDetail) && (
          <div className="info-item parking-item">
            <i className="ico-parking"></i>
            <div className="parking-content">
              <span className="parking-header">주차 안내</span>
              {store.parkingTitle && (
                <span className="parking-title">
                  {store.parkingTitle}
                </span>
              )}
              {store.parkingDetail && (
                <span className="parking-detail-text">
                  {store.parkingDetail}
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Event Banner */}
      {store.bottomEventBanner && store.bottomEventBanner !== "null" && store.bottomEventBanner.trim() !== "" && (
        <div className="store-event-banner">
          <img src={store.bottomEventBanner} alt="Event Banner" className="event-image" />
        </div>
      )}
    </div>
  );
}

export default StoreDetail;
