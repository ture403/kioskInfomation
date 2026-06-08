import React, { useState, useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import "../../assets/styles/public.css";

function Content({ cards, onStoreSelect }) {
  const [swiper, setSwiper] = useState(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (swiper) {
      timeoutRef.current = setTimeout(() => {
        swiper.update();
        // 비동기 데이터 로딩 후 autoplay가 멈춰있는 현상을 방지하기 위해 강제 시작
        if (swiper.autoplay && !swiper.autoplay.running) {
          swiper.autoplay.start();
        }
      }, 100);
    }
    
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [swiper, cards]);

  return (
    <div className="main-content">
      <div className="welcome-section">
        <div className="logo-mark"></div>
        <h1 className="welcome-title">신한 Premier 청담건물에 오신 것을 환영합니다.</h1>
      </div>

      {/* Swiper Slider */}
      <div className="slider-section">
        {!cards || cards.length === 0 ? (
          <div style={{ textAlign: "center", color: "white", padding: "80px", fontSize: "20px" }}>입점사 대기중 입니다.</div>
        ) : (
          <Swiper
            key={`swiper-${cards.length}`}
            grabCursor={true}
            centeredSlides={true}
            slidesPerView={"auto"}
            // spaceBetween={40}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            observer={true}
            observeParents={true}
            roundLengths={true}
            onSwiper={setSwiper}
            modules={[Autoplay]}
            className="public-swiper"
          >
            {(() => {
              if (!cards || cards.length === 0) return null;

              let displayCards = [...cards];
              let multiplier = 2;
              // 루프 모드를 위해 최소 15개 이상의 슬라이드 보장
              while (displayCards.length < 15) {
                displayCards = [...displayCards, ...cards.map((c) => ({ ...c, id: c.id + "_" + multiplier }))];
                multiplier++;
              }

              return displayCards.map((card) => (
                <SwiperSlide key={card.id}>
                  <div className="slide-card">
                    <div className="slide-image-placeholder">
                      {card.image && card.image !== "null" && card.image.trim() !== "" && (
                        <img src={card.image} alt={card.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      )}
                      <button className="detail-btn" onClick={() => onStoreSelect(card.id.toString().split("_")[0])}>
                        <i className="ico-view"></i>
                        <span>상세보기</span>
                      </button>
                    </div>
                    <div className="slide-content">
                      <h2 className="slide-title">{card.title}</h2>
                      {card.floor && (
                        <div className="slide-info">
                          <div className="slice-info-detail">
                            <div className="slice-info-half">
                              <div className="slice-info-detail">
                                <i className="ico-type"></i>{card.category}
                              </div>
                              <div className="slice-info-detail">
                                <i className="ico-map"></i> {card.floor}
                              </div>
                            </div>
                          </div>
                          <div className="slice-info-detail">
                            <i className="ico-time"></i> {card.hours}
                          </div>
                          <div className="slice-info-detail">
                            <i className="ico-call"></i> {card.phone}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </SwiperSlide>
              ));
            })()}
          </Swiper>
        )}
      </div>
    </div>
  );
}

export default Content;
