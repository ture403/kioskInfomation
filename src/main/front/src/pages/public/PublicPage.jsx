import React, { useState, useEffect } from "react";
import Header from "../../components/public/Header";
import NewsBanner from "../../components/public/NewsBanner";
import Content from "../../components/public/Content";
import BottomBanner from "../../components/public/BottomBanner";
import StoreDetail from "../../components/public/StoreDetail";
import { fetchApi } from "../../utils/api";

function PublicPage() {
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [newsText, setNewsText] = useState("");
  const [commonInfo, setCommonInfo] = useState({
    address: "",
    textTicker: "경제",
    parkingTitle: "",
    parkingDetail: "",
    buildingInfo: "",
  });

  const [cards, setCards] = useState([]);

  useEffect(() => {
    const loadCommonInfoAndNews = async () => {
      let currentCategory = "경제"; // default

      try {
        const infoRes = await fetchApi("/api/common-info");
        if (infoRes && infoRes.response) {
          setCommonInfo({
            address: infoRes.response.address || "",
            textTicker: infoRes.response.textTicker || "경제",
            parkingTitle: infoRes.response.parkingTitle || "",
            parkingDetail: infoRes.response.parkingDetail || "",
            buildingInfo: infoRes.response.buildingInfo || "",
          });

          if (infoRes.response.textTicker) {
            currentCategory = infoRes.response.textTicker;
          }
        }
      } catch (error) {
        console.error("Failed to fetch common info", error);
      }

      // Fetch news or display custom text
      try {
        // 정확히 "경제"라는 단어 하나일 때만 API를 타고, 나머지는 모두 직접입력(Custom)으로 처리
        const isCustom = currentCategory !== "경제";

        if (isCustom) {
          // 직접입력 모드: 뉴스 API를 호출하지 않고 입력된 텍스트를 바로 티커에 띄움
          setNewsText(` ${currentCategory} `);
        } else {
          const newsRes = await fetchApi(`/api/news?category=${currentCategory}`);
          if (newsRes && newsRes.response && newsRes.response.length > 0) {
            const headlines = newsRes.response.map((title) => `${title}`).join(" ㆍ ");
            setNewsText(headlines);
          } else {
            // 통신은 성공했으나 뉴스가 없을 경우, 기존 뉴스가 있다면 유지
            setNewsText((prev) => (prev ? prev : ""));
          }
        }
      } catch (error) {
        console.error("News API Error:", error);
        // 통신 에러 발생 시 기존 뉴스를 지우지 않고 유지하여 화면 깜빡임 방지
      }
    };

    loadCommonInfoAndNews();

    const loadStores = async () => {
      try {
        const storesRes = await fetchApi("/api/stores");
        if (storesRes && storesRes.response) {
          const mappedCards = storesRes.response.map((store) => ({
            id: store.id,
            title: store.name,
            floor: store.floor,
            category: store.category,
            hours: store.operationHours1,
            phone: store.phone,
            image: store.mainCardImage,
          }));

          setCards((prev) => {
            if (JSON.stringify(prev) !== JSON.stringify(mappedCards)) {
              return mappedCards;
            }
            return prev;
          });
        }
      } catch (error) {
        console.error("Failed to fetch stores", error);
      }
    };
    loadStores();

    // 1분 마다 입점사 데이터 갱신 (관리자 변경 사항 반영)
    const storeTimer = setInterval(loadStores, 60000);

    // 1시간 마다 뉴스 갱신
    const timer = setInterval(loadCommonInfoAndNews, 60 * 60 * 1000);

    // 24시간 연속 가동용 안전장치: 매일 새벽 4시 자동 새로고침 (브라우저 메모리 가비지 컬렉션)
    const now = new Date();
    const reloadTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 4, 0, 0, 0);
    if (now.getTime() > reloadTime.getTime()) {
      reloadTime.setDate(reloadTime.getDate() + 1);
    }
    const timeUntilReload = reloadTime.getTime() - now.getTime();
    const reloadTimer = setTimeout(() => {
      window.location.reload();
    }, timeUntilReload);

    return () => {
      clearInterval(timer);
      clearInterval(storeTimer);
      clearTimeout(reloadTimer);
    };
  }, []);

  return (
    <div className="public-layout">
      {/* Top Header */}
      <Header />

      {selectedStoreId ? (
        <StoreDetail storeId={selectedStoreId} onBack={() => setSelectedStoreId(null)} />
      ) : (
        <>
          {/* News Banner */}
          {newsText && newsText.trim() !== "" && <NewsBanner newsText={newsText} />}
          {/* Main Content */}
          <Content cards={cards} onStoreSelect={setSelectedStoreId} />
          {/* 
          Bottom Info Banner */}
          {commonInfo.buildingInfo && <BottomBanner
            parkingTitle={commonInfo.parkingTitle}
            parkingDetail={commonInfo.parkingDetail}
            buildingInfo={commonInfo.buildingInfo}
          />}

        </>
      )}
    </div>
  );
}

export default PublicPage;
