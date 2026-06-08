import React from "react";

function BottomBanner({ buildingInfo }) {
  return (
    <div className="bottom-info-banner horizontal-layout">
      <div className="info-icon-wrapper">
          <div className="ico-info"></div>
      </div>
      <div className="info-content-wrapper">
        <h3 className="info-title">영업 안내</h3>
        <p className="info-desc">
          {buildingInfo || "각 영업점 및 테넌트의 상세 운영 시간과 주차정보는 카드 섹션 상세보기를 통해 확인하실 수 있습니다"}
        </p>
      </div>
    </div>
  );
}

export default BottomBanner;
