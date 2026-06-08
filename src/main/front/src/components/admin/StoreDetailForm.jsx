import React, { useState, useRef, useEffect } from "react";
import { fetchApi } from "../../utils/api";

function StoreDetailForm({ storeId, onBack }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    floorPrefix: "지상",
    floorNumber: "",
    phone1: "",
    phone2: "",
    phone3: "",
    operationHours1: "",
    operationHours2: "",
    parkingTitle: "",
    parkingDetail: "",
  });

  const [files, setFiles] = useState({
    mainCardImage: null,
    detailMainImage: null,
    storeGuideImage: null,
    bottomEventBanner: null,
  });

  const [deletedImageFields, setDeletedImageFields] = useState([]);

  const fileRefs = {
    mainCardImage: useRef(null),
    detailMainImage: useRef(null),
    storeGuideImage: useRef(null),
    bottomEventBanner: useRef(null),
  };

  useEffect(() => {
    if (storeId) {
      loadStoreData();
    }
  }, [storeId]);

  const loadStoreData = async () => {
    try {
      const res = await fetchApi(`/api/stores/${storeId}`);
      if (res && res.response) {
        const store = res.response;

        let floorPrefix = "지상";
        let floorNumber = "";
        if (store.floor) {
          const match = store.floor.match(/(지상|지하)\s*(\d+)층/);
          if (match) {
            floorPrefix = match[1];
            floorNumber = match[2];
          } else {
            floorNumber = store.floor.replace(/[^0-9]/g, "");
            if (store.floor.includes("지하")) floorPrefix = "지하";
          }
        }

        const phones = store.phone ? store.phone.split("-") : ["", "", ""];

        setFormData({
          name: store.name || "",
          description: store.description || "",
          category: store.category || "",
          floorPrefix,
          floorNumber,
          phone1: phones[0] || "",
          phone2: phones[1] || "",
          phone3: phones[2] || "",
          operationHours1: store.operationHours1 || "",
          operationHours2: store.operationHours2 || "",
          parkingTitle: store.parkingTitle || "",
          parkingDetail: store.parkingDetail || "",
        });

        setFiles({
          mainCardImage: store.mainCardImage ? { name: store.mainCardImage.split("/").pop() } : null,
          detailMainImage: store.detailMainImage ? { name: store.detailMainImage.split("/").pop() } : null,
          storeGuideImage: store.storeGuideImage ? { name: store.storeGuideImage.split("/").pop() } : null,
          bottomEventBanner: store.bottomEventBanner ? { name: store.bottomEventBanner.split("/").pop() } : null,
        });
      }
    } catch (e) {
      console.error("Failed to load store data:", e);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("phone")) {
      // 숫자만 입력 가능하도록 정규식 처리
      const numericValue = value.replace(/[^0-9]/g, "");
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [fieldName]: file }));
      setDeletedImageFields((prev) => prev.filter((field) => field !== fieldName));
    }
  };

  const handleDeleteImage = (fieldName) => {
    if (window.confirm("해당 이미지를 삭제하시겠습니까?")) {
      setFiles((prev) => ({ ...prev, [fieldName]: null }));
      if (!deletedImageFields.includes(fieldName)) {
        setDeletedImageFields((prev) => [...prev, fieldName]);
      }
    }
  };

  const handleSave = async () => {
    // 폼 필수 값 검증
    if (!formData.name.trim()) return alert("입점사 명을 입력해주세요.");
    if (!formData.description.trim()) return alert("소개 문구를 입력해주세요.");
    if (!formData.category.trim()) return alert("업종을 입력해주세요.");
    if (!formData.floorNumber.trim()) return alert("층수를 입력해주세요.");
    if (!formData.phone1.trim() || !formData.phone2.trim() || !formData.phone3.trim()) return alert("전화번호를 모두 입력해주세요.");
    if (!formData.operationHours1.trim()) return alert("운영 안내 01을 입력해주세요.");

    try {
      const storeData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        floor: `${formData.floorPrefix} ${formData.floorNumber}층`.trim(),
        phone: `${formData.phone1}-${formData.phone2}-${formData.phone3}`,
        operationHours1: formData.operationHours1,
        operationHours2: formData.operationHours2,
        parkingTitle: formData.parkingTitle,
        parkingDetail: formData.parkingDetail,
        deletedImages: deletedImageFields,
      };

      const data = new FormData();
      data.append("store", new Blob([JSON.stringify(storeData)], { type: "application/json" }));

      // Only append if it's an actual File object (new upload), not a placeholder Object
      if (files.mainCardImage instanceof File) data.append("mainCardImage", files.mainCardImage);
      if (files.detailMainImage instanceof File) data.append("detailMainImage", files.detailMainImage);
      if (files.storeGuideImage instanceof File) data.append("storeGuideImage", files.storeGuideImage);
      if (files.bottomEventBanner instanceof File) data.append("bottomEventBanner", files.bottomEventBanner);

      const url = storeId ? `/api/stores/${storeId}` : "/api/stores";
      const method = storeId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        body: data,
      });

      if (response.ok) {
        alert(storeId ? "수정되었습니다." : "저장되었습니다.");
        onBack();
      } else {
        alert("저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("Save error", error);
      alert("서버 오류가 발생했습니다.");
    }
  };

  return (
    <div className="admin-content-inner">
      <div className="admin-content-header">
        <h2>입점사 통합 관리 상세</h2>
      </div>

      <div className="admin-form-section" style={{ maxWidth: "800px" }}>
        {/* 입점사 기본 정보 */}
        <div className="form-group-container">
          <div className="form-group-title">
            <span className="title-bar"></span> 입점사 기본 정보
          </div>
          <div className="form-group">
            <label>입점사 명</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="예: 신한 Premier PWM"
            />
          </div>
          <div className="form-group">
            <label>소개 문구</label>
            <div className="textarea-wrapper">
              <textarea
                className="form-control"
                rows="4"
                name="description"
                value={formData.description}
                onChange={handleChange}
                maxLength={400}
                placeholder="소개 문구를 입력하세요."
              ></textarea>
              <div className="char-count">( {formData.description.length} / 400 )</div>
            </div>
          </div>

          <div className="form-row-2">
            <div className="form-group flex-1">
              <label>업종</label>
              <input
                type="text"
                className="form-control"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="예: 금융 업무"
              />
            </div>
            <div className="form-group flex-1">
              <label>층수</label>
              <div className="floor-input-group">
                <select
                  className="form-control dropdown"
                  name="floorPrefix"
                  value={formData.floorPrefix}
                  onChange={handleChange}
                  style={{ width: "100px" }}
                >
                  <option value="지상">지상</option>
                  <option value="지하">지하</option>
                </select>
                <input
                  type="text"
                  className="form-control"
                  name="floorNumber"
                  value={formData.floorNumber}
                  onChange={handleChange}
                  style={{ width: "100px" }}
                  placeholder="예: 2"
                />
                <span style={{ fontSize: "14px", fontWeight: "bold" }}>층</span>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label>전화 번호</label>
            <div className="phone-input-group">
              <input
                type="text"
                className="form-control"
                name="phone1"
                value={formData.phone1}
                onChange={handleChange}
                placeholder="02"
                maxLength={4}
              />
              <span>-</span>
              <input
                type="text"
                className="form-control"
                name="phone2"
                value={formData.phone2}
                onChange={handleChange}
                placeholder="0000"
                maxLength={4}
              />
              <span>-</span>
              <input
                type="text"
                className="form-control"
                name="phone3"
                value={formData.phone3}
                onChange={handleChange}
                placeholder="0000"
                maxLength={4}
              />
            </div>
          </div>
        </div>

        {/* 영업시간 설정 */}
        <div className="form-group-container">
          <div className="form-group-title">
            <span className="title-bar"></span> 영업시간 설정
          </div>
          <div className="form-row-2">
            <div className="form-group flex-1">
              <label>운영 안내 01</label>
              <input
                type="text"
                className="form-control"
                name="operationHours1"
                value={formData.operationHours1}
                onChange={handleChange}
                placeholder="예: 평일 09:00 ~ 16:00"
              />
            </div>
            <div className="form-group flex-1">
              <label>운영 안내 02</label>
              <input
                type="text"
                className="form-control"
                name="operationHours2"
                value={formData.operationHours2}
                onChange={handleChange}
                placeholder="예: 토·일요일 및 공휴일 휴무"
              />
            </div>
          </div>
        </div>

        {/* 주차 안내 */}
        <div className="form-group-container">
          <div className="form-group-title">
            <span className="title-bar"></span> 주차 안내
          </div>
          <div className="form-group">
            <label>요금 안내</label>
            <input
              type="text"
              className="form-control"
              name="parkingTitle"
              value={formData.parkingTitle}
              onChange={handleChange}
              placeholder="기본 1시간 무료 초과 10분 / 800원"
            />
          </div>
          <div className="form-group">
            <label>상세 안내</label>
            <div className="textarea-wrapper">
              <textarea
                className="form-control"
                rows="3"
                name="parkingDetail"
                value={formData.parkingDetail}
                onChange={handleChange}
                maxLength={200}
                placeholder="쾌적한 주차 이용을 위해..."
              ></textarea>
              <div className="char-count">( {formData.parkingDetail.length} / 200 )</div>
            </div>
          </div>
        </div>

        <hr className="divider" />

        {/* 이미지 컨텐츠 관리 */}
        <div className="form-group-container">
          <div className="form-group-title">
            <span className="title-bar"></span> 이미지 컨텐츠 관리
          </div>

          <div className="form-group">
            <label>메인 카드 이미지</label>
            <p className="image-help-text">
              설명: <b>메인 화면</b> 입점사 리스트에 노출되는 <b>썸네일</b>입니다.
              <br />
              상세 규격: 권장 사양 - 가로 500px × 세로 500px (1:1 비율)
              <br />
              파일 형식: jpg, png
            </p>
            <div className="file-input-group">
              <input
                type="text"
                className="form-control"
                readOnly
                value={files.mainCardImage ? files.mainCardImage.name : ""}
                placeholder="이미지 파일명.jpg"
              />
              <button className="btn-file" onClick={() => fileRefs.mainCardImage.current.click()}>
                파일찾기
              </button>
              {files.mainCardImage && (
                <button
                  className="btn-file-delete"
                  onClick={() => handleDeleteImage("mainCardImage")}
                >
                  삭제
                </button>
              )}
              <input
                type="file"
                ref={fileRefs.mainCardImage}
                style={{ display: "none" }}
                accept="image/jpeg, image/png"
                onChange={(e) => handleFileChange(e, "mainCardImage")}
              />
            </div>
          </div>

          <div className="form-group">
            <label>상세 메인 이미지</label>
            <p className="image-help-text">
              설명: <b>상세페이지</b> 최상단 배경으로 활용되는 고해상도 이미지입니다.
              <br />
              상세 규격: 권장 사양 - 가로 960px × 세로 720px (4:3 비율)
              <br />
              파일 형식: jpg, png
            </p>
            <div className="file-input-group">
              <input
                type="text"
                className="form-control"
                readOnly
                value={files.detailMainImage ? files.detailMainImage.name : ""}
                placeholder="이미지 파일명.jpg"
              />
              <button className="btn-file" onClick={() => fileRefs.detailMainImage.current.click()}>
                파일찾기
              </button>
              {files.detailMainImage && (
                <button
                  className="btn-file-delete"
                  onClick={() => handleDeleteImage("detailMainImage")}
                >
                  삭제
                </button>
              )}
              <input
                type="file"
                ref={fileRefs.detailMainImage}
                style={{ display: "none" }}
                accept="image/jpeg, image/png"
                onChange={(e) => handleFileChange(e, "detailMainImage")}
              />
            </div>
          </div>

          <div className="form-group">
            <label>입점사 안내 이미지</label>
            <p className="image-help-text">
              설명: 입점사 안내 관련 이미지 입니다. 주로 <b>도면이나 오시는길 이미지</b>가 배치됩니다.
              <br />
              상세 규격: 권장 사양 - 가로 420px × 세로 210px (2:1 비율)
              <br />
              파일 형식: jpg, png
            </p>
            <div className="file-input-group">
              <input
                type="text"
                className="form-control"
                readOnly
                value={files.storeGuideImage ? files.storeGuideImage.name : ""}
                placeholder="이미지 파일명.jpg"
              />
              <button className="btn-file" onClick={() => fileRefs.storeGuideImage.current.click()}>
                파일찾기
              </button>
              {files.storeGuideImage && (
                <button
                  className="btn-file-delete"
                  onClick={() => handleDeleteImage("storeGuideImage")}
                >
                  삭제
                </button>
              )}
              <input
                type="file"
                ref={fileRefs.storeGuideImage}
                style={{ display: "none" }}
                accept="image/jpeg, image/png"
                onChange={(e) => handleFileChange(e, "storeGuideImage")}
              />
            </div>
          </div>

          <div className="form-group">
            <label>하단 이벤트 배너</label>
            <p className="image-help-text">
              설명: 입점사의 <b>이벤트</b> 혹은 <b>안내 배너 영역</b> 이미지입니다.
              <br />
              상세 규격: 권장 사양 - 가로 960px × 세로 300px (16:5 비율)
              <br />
              파일 형식: jpg, png
            </p>
            <div className="file-input-group">
              <input
                type="text"
                className="form-control"
                readOnly
                value={files.bottomEventBanner ? files.bottomEventBanner.name : ""}
                placeholder="이미지 파일명.jpg"
              />
              <button className="btn-file" onClick={() => fileRefs.bottomEventBanner.current.click()}>
                파일찾기
              </button>
              {files.bottomEventBanner && (
                <button
                  className="btn-file-delete"
                  onClick={() => handleDeleteImage("bottomEventBanner")}
                >
                  삭제
                </button>
              )}
              <input
                type="file"
                ref={fileRefs.bottomEventBanner}
                style={{ display: "none" }}
                accept="image/jpeg, image/png"
                onChange={(e) => handleFileChange(e, "bottomEventBanner")}
              />
            </div>
          </div>
        </div>

        <div className="form-actions two-buttons">
          <button className="btn-back" onClick={onBack}>
            목록으로 돌아가기
          </button>
          <button className="btn-save" onClick={handleSave}>
            저장 하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default StoreDetailForm;
