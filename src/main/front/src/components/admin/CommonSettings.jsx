import React, { useState, useEffect } from "react";
import { fetchApi } from "../../utils/api";

function CommonSettings() {
  const [formData, setFormData] = useState({
    address: "",
    textTicker: "경제",
    buildingInfo: "",
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const [tickerMode, setTickerMode] = useState("경제");
  const [customTicker, setCustomTicker] = useState("");
  const [addressSuggestions, setAddressSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const loadData = async () => {
    try {
      const response = await fetchApi("/api/common-info");
      if (response && response.response) {
        const dbTicker = response.response.textTicker || "경제";
        const isCustom = dbTicker !== "경제";

        setTickerMode(isCustom ? "직접입력" : dbTicker);
        setCustomTicker(isCustom ? dbTicker : "");

        setFormData({
          address: response.response.address || "",
          textTicker: dbTicker,
          buildingInfo: response.response.buildingInfo || "",
        });
      }
    } catch (error) {
      console.error("Failed to load common info", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "address") {
      if (value.trim().length > 1) {
        try {
          const res = await fetchApi(`/api/weather/search?query=${encodeURIComponent(value.trim())}`);
          if (res && res.response && res.response.length > 0) {
            setAddressSuggestions(res.response);
            setShowSuggestions(true);
          } else {
            setShowSuggestions(false);
          }
        } catch (error) {
          console.error("Failed to fetch address suggestions", error);
        }
      } else {
        setAddressSuggestions([]);
        setShowSuggestions(false);
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setFormData((prev) => ({ ...prev, address: suggestion }));
    setShowSuggestions(false);
  };

  const handleTickerModeChange = (e) => {
    const value = e.target.value;
    setTickerMode(value);
    if (value !== "직접입력") {
      setFormData((prev) => ({ ...prev, textTicker: value }));
    } else {
      setFormData((prev) => ({ ...prev, textTicker: customTicker }));
    }
  };

  const handleCustomTickerChange = (e) => {
    const value = e.target.value;
    setCustomTicker(value);
    setFormData((prev) => ({ ...prev, textTicker: value }));
  };

  const handleSave = async () => {
    try {
      await fetchApi("/api/common-info", "POST", formData);
      alert("저장되었습니다.");
    } catch (error) {
      console.error("Save error", error);
      alert("저장에 실패했습니다.");
    }
  };

  if (isLoading) return <div>로딩중...</div>;

  return (
    <div className="admin-content-inner">
      <div className="admin-content-header">
        <h2>공통정보 관리</h2>
      </div>

      <div className="admin-form-section">
        {/* 날씨 및 위치 설정 */}
        <div className="form-group-container">
          <div className="form-group-title">
            <span className="title-bar"></span> 날씨 및 위치 설정
          </div>
          <div className="form-group">
            <label>주소</label>
            <div style={{ position: "relative", flex: 1, width: "100%" }}>
              <input
                type="text"
                className="form-control"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="서울시 강남구 청담동"
                autoComplete="off"
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onFocus={(e) => {
                  if (e.target.value.trim().length > 1 && addressSuggestions.length > 0) {
                    setShowSuggestions(true);
                  }
                }}
                style={{ width: "100%" }}
              />
              {showSuggestions && (
                <ul style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  maxHeight: "200px",
                  overflowY: "auto",
                  zIndex: 1000,
                  listStyle: "none",
                  padding: 0,
                  margin: "5px 0 0 0",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
                }}>
                  {addressSuggestions.map((suggestion, idx) => (
                    <li 
                      key={idx}
                      style={{ padding: "10px 15px", cursor: "pointer", borderBottom: "1px solid #f0f0f0", fontSize: "14px", color: "#333" }}
                      onMouseDown={() => handleSuggestionClick(suggestion)}
                      onMouseEnter={(e) => e.target.style.backgroundColor = "#f0f7ff"}
                      onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <span className="address-guide-text" style={{ display: "block", marginTop: "10px", width: "100%" }}>
              ※ 정확한 날씨 좌표 연동을 위해 반드시 <strong>'시 구 동' 단위(지번 주소)</strong>로 띄어쓰기하여 입력해 주세요.
              <br />※ 도로명 주소는 날씨 정보와 연동되지 않습니다.
            </span>
          </div>
        </div>

        {/* 텍스트 티커 설정 기능 */}
        <div className="form-group-container">
          <div className="form-group-title">
            <span className="title-bar"></span> 뉴스 티커 옵션 리스트
          </div>
          <div className="form-group">
            <select className="form-control dropdown" value={tickerMode} onChange={handleTickerModeChange}>
              <option value="경제">경제</option>
              <option value="직접입력">직접입력</option>
              {/* <option value="종합">종합</option>
              <option value="IT">IT/과학</option>
              <option value="스포츠">스포츠</option>
              <option value="부동산">부동산 (검색)</option>
              <option value="주식">주식 (검색)</option>
              <option value="환율">환율 (검색)</option> */}
            </select>

            {tickerMode === "직접입력" && (
              <div className="textarea-wrapper" style={{ marginTop: "15px" }}>
                <textarea
                  className="form-control"
                  rows="3"
                  value={customTicker}
                  onChange={handleCustomTickerChange}
                  maxLength={100}
                  placeholder="티커에 노출할 내용을 직접 입력하세요."
                ></textarea>
                <div className="char-count">( {customTicker.length} / 100 )</div>
              </div>
            )}
          </div>
        </div>

        {/* 건물 안내 */}
        <div className="form-group-container">
          <div className="form-group-title">
            <span className="title-bar"></span> 건물 안내
          </div>
          <div className="form-group">
            <label>내용</label>
            <div className="textarea-wrapper">
              <textarea
                className="form-control"
                rows="3"
                name="buildingInfo"
                value={formData.buildingInfo}
                onChange={handleChange}
                maxLength={200}
                placeholder="각 영업점 및 매장의 상세 운영 시간은 카드 섹션을 통해 확인하실 수 있습니다"
              ></textarea>
              <div className="char-count">( {formData.buildingInfo.length} / 200 )</div>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button className="btn-save" onClick={handleSave}>
            저장 하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default CommonSettings;
