# Kiosk Project

키오스크 안내 프로젝트입니다. 방문 고객을 위한 실시간 안내, 층별 시설 안내, 최신 금융 경제 뉴스 제공 등을 목적으로 합니다.

## 1. 최근 주요 업데이트 사항
- **[2026-05-15]**
  - 백엔드/프론트엔드(관리자): 입점사 상세 관리 폼(`StoreDetailForm.jsx`) 내 이미지 업로드 필드에 개별 이미지 삭제 기능 신규 구축.
    - 프론트엔드: 실수 방지를 위한 `window.confirm` 컨펌창 적용 및 `deletedImages` 상태 관리 로직 추가.
    - 프론트엔드: 버튼 UI 인라인 스타일을 `admin.css`의 `.btn-file-delete` 공통 클래스로 모듈화 및 해상도 변화 시 버튼 글자 세로 깨짐(줄바꿈) 방지 처리(`white-space: nowrap`, `flex-shrink: 0`).
    - 백엔드: `StoreInfo` 엔티티에 영속되지 않는 `@Transient deletedImages` 필드를 추가하여, `StoreInfoService`에서 해당 배열을 순회하며 기존 이미지 데이터를 안전하게 삭제(`null` 처리)하도록 고도화.
  - 백엔드(방어로직): 프론트엔드(React SPA) 빌드 통합 후, 존재하지 않는 라우트 접근 또는 새로고침 시 Spring Boot의 404 Whitelabel Error Page가 노출되는 현상 해결. 404 Not Found 발생 시 `index.html`로 자동 포워딩하도록 `CustomErrorController`를 신규 구축하여 프론트엔드의 커스텀 에러 페이지로 제어권을 위임.
  - 환경설정(Git): 프론트엔드/백엔드 통합 빌드 자동화 스크립트(`build_project.bat`)를 형상 관리 대상에 정식으로 포함하여, 다른 PC 및 인프라 환경에서도 동일한 1-Click 빌드가 가능하도록 `.gitignore` 정책 수정.
- **[2026-05-14]**
  - 프론트엔드(방어로직): 키오스크 초기 구동 시 외부 API 통신 지연이나 네트워크 오류로 인해 날씨 데이터(초기값 `"-"`)를 받아오지 못한 경우, 미관상 어색한 빈 온도 표시(`-°`)를 띄우지 않고 날씨 영역 전체를 완전히 숨김(조건부 렌더링) 처리하여 UX 개선.
  - 환경설정(빌드): 프론트엔드(React/Vite)와 백엔드(Spring Boot) 통합 빌드 과정을 원클릭으로 자동화하기 위한 윈도우 배치 스크립트(`build_project.bat`) 신규 추가. PC 환경의 `JAVA_HOME` 변수 충돌(JDK 8 등)을 방지하고자 스크립트 내부에서 JDK 17로 자동 설정 후 빌드 진행.
  - 프론트엔드(방어로직): 키오스크 운영 중 브라우저 상단에 "이 페이지를 번역하시겠습니까?" 팝업이 노출되는 것을 원천 차단하기 위해 `index.html` 내에 `<meta name="google" content="notranslate" />` 태그 추가 및 <html> 태그의 언어 속성을 `lang="ko"`로 수정 완료.
  - 프론트엔드(방어로직): 퍼블릭 페이지(`PublicPage.jsx`)에서 1시간 단위 주기적 뉴스 데이터 갱신 시, 외부 API 통신 실패 또는 빈 데이터 응답이 발생하더라도 기존에 로드된 뉴스 텍스트를 초기화하지 않고 그대로 유지하도록 수정. (키오스크 무중단 운영 중 뉴스 배너가 갑자기 사라지는 현상 방지)
  - 프론트엔드(UI/UX): 입점사 상세보기 화면(`StoreDetail.jsx`) 진입 후 사용자 상호작용(터치, 스크롤 등)이 없을 때 자동으로 메인 화면으로 복귀하는 대기(Idle) 시간을 기존 10초에서 1분(60초)으로 대폭 연장하여 사용자 정보 열람 편의성 향상.
  - 프론트엔드(UI/UX): 고해상도(1080x1920) 디스플레이에서 `Swiper` Coverflow 3D 효과 사용 시 발생하는 고질적인 브라우저 텍스트/이미지 뭉개짐(Blur) 현상을 완전히 근절하기 위해 3D 원근감(`depth`) 및 스케일(`scale`) 효과를 제거. 선명도 100% 보장을 위한 플랫(Flat) 2D 카로셀 레이아웃으로 롤백 및 불필요한 3D 가속 CSS 속성 일괄 클린업 (`Content.jsx`, `public.css`).
  - 백엔드/프론트엔드(날씨 API): 기상청 실황(`getUltraSrtNcst`) 대신 초단기예보(`getUltraSrtFcst`) API로 전면 교체 및 매시 45분 기준 `baseTime` 갱신 정책 반영.
  - 프론트엔드(UI/UX): 프론트엔드 상단 헤더(`Header.jsx`) 날씨 아이콘을 기존 텍스트(이모지)에서 CSS 클래스 기반 커스텀 아이콘으로 변경 및 단기예보 '소나기(PTY=4)'에 대한 예외/방어 로직 추가.
  - 프론트엔드/백엔드(관리자): 관리자 공통정보 설정 화면(`CommonSettings.jsx`)의 '주소' 입력 필드에, 관리자 편의성 및 데이터 정확성 향상을 위한 **자동완성(Autocomplete) 기능** 신규 구현. (백엔드 `coordinate_code.json` 메모리 로딩 기반 `/api/weather/search` 검색 API 신설)
  - 프론트엔드(버그픽스): `useIdleTimeout.js` 내에 잘못 포함되어 있던 `setTimeout` 콜백 함수명 오타(`eaderhandleTimeout` -> `handleTimeout`) 수정 완료.
- **[2026-05-13]**
  - 백엔드/프론트엔드(기능 변경): 뉴스 카테고리의 초기 기본값을 기존 '종합'에서 '경제'로 일괄 변경하여 초기 진입 시 경제 뉴스가 우선 노출되도록 적용.
  - 프론트엔드(리팩토링): `NewsBanner.jsx`에서 `style` 속성의 동적 변수 적용 코드 포맷팅 최적화.
  - 백엔드(리팩토링): `AdminController`에서 초기 개발용으로 사용되던 관리자 비밀번호 암호화 마이그레이션(단방향 덮어쓰기) 임시 로직 제거를 통해 코드 정리.
  - 프론트엔드(UI/UX): 공식 브랜드 가이드 컬러 팔레트(`735A45`, `CEA757`, `FEC255`, `F6F7F9`) 기준으로 프론트엔드 전체(퍼블릭 키오스크 및 관리자 대시보드) CSS 색상을 전면 교체하여 디자인 일체감 및 럭셔리 톤앤매너 극대화.
  - 프론트엔드(퍼블릭/관리자): 관리자 텍스트 티커 설정 및 화면 표시의 조건부 렌더링 검증 로직을 `includes` 배열 검색 방식에서 `!== "경제"` 명시적 비교 연산으로 단순화. 이를 통해 사용자가 "오늘의 경제" 등 특정 단어가 포함된 커스텀 텍스트를 입력하더라도 충돌 없이 안전하게 직접입력 모드로 작동하도록 예외 차단.
  - 프론트엔드(퍼블릭): 직접입력 모드 시 텍스트 길이가 너무 짧아 티커 애니메이션이 멈춘 것처럼 보이는 현상 해결. 텍스트가 짧을 경우 화면을 꽉 채우도록 자동 반복 생성하며, 텍스트 길이에 비례한 동적 애니메이션 지속 시간(`duration`)을 계산하여 긴 뉴스든 짧은 문구든 항상 일정한 스크롤 속도 유지 (`NewsBanner.jsx`).
  - 프론트엔드(리팩토링): 티커 애니메이션의 동적 지속 시간 제어 로직을 인라인 스타일(`style`)에서 CSS 변수(`--banner-duration`) 방식으로 변경하여, 스타일 속성 제어 권한을 외부 스타일시트(`public.css`)로 완벽히 분리 및 모듈화.
- **[2026-05-12]**
  - 백엔드: 기상청 단기예보(초단기예보) API 연동을 위한 `WeatherService`, `WeatherController` 신규 구축 및 `application.yml` 환경변수 연동.
  - 백엔드: 글로벌 API 요청/응답 로깅 처리를 위한 전역 필터 `ApiLoggingFilter` (OncePerRequestFilter) 도입.
  - 백엔드: `WeatherService` 단에서 기상청 KMA 원본 JSON 응답 및 파싱 결과 모니터링을 위한 `@Slf4j` 로깅 적용.
  - 프론트엔드(퍼블릭): 상단 헤더(`Header.jsx`)에 백엔드 `/api/weather` 호출 로직 추가 및 30분 단위 자동 갱신(Auto Refresh) 적용.
  - **[기상청 API 아키텍처 개편 및 고도화]**
    - 백엔드: `coordinate_code.json` 정적 데이터 파일을 추가하여, 관리자가 입력한 주소(`CommonInfo`)를 기반으로 기상청 `nx`, `ny` 좌표를 동적 매핑하도록 로직 개선 (매칭 실패 시 서울 종로구 60, 127 폴백 적용).
    - 백엔드: 기상청 API 엔드포인트를 초단기예보(`getUltraSrtFcst`)에서 초단기실황(`getUltraSrtNcst`)으로 변경 및 발표 시각(40분) 계산식 보정.
    - 아키텍처(BFF 원복): 프론트엔드가 원본 데이터를 파싱하던 구조에서, 다시 백엔드(`WeatherService`)가 `T1H`, `SKY`, `PTY` 필수 데이터만 추출해 프론트엔드로 전달하는 정석적인 BFF(Backend for Frontend) 패턴으로 원상 복구 및 최적화함.
    - 프론트엔드: 개발 환경에서 StrictMode로 인한 API 이중 호출 방지를 위해 `main.jsx`의 `<StrictMode>` 제거.
  - 보안/네트워크: 인트라넷(내부망)에서 다른 PC가 IP 기반으로 접근할 때 API 차단이 발생하지 않도록 `WebConfig.java`에 전역 CORS 설정(`allowedOriginPatterns("*")`) 추가 완료.
  - **[로깅 및 디버그 고도화]**
    - 백엔드: `WeatherController`에 `@Slf4j`를 적용하여 수신된 날씨 요청과 프론트로 반환되는 최종 응답 데이터(`weatherData`)를 명확히 출력하도록 로깅 강화.
    - 백엔드: 기상청 API 연동의 유연성을 위해 `WeatherService.java`에 주소 정규화 로직(`normalizeRegion`) 추가. 사용자가 "서울시 동작구"처럼 축약형이나 부분 주소를 입력해도 공식 명칭("서울특별시 동작구")으로 자동 치환하여 매핑되도록 편의성 대폭 개선.
    - 프론트엔드: 관리자 공통 설정(`CommonSettings.jsx`) 화면에 날씨 좌표 연동용 '시 구 동' 지번 주소 입력 가이드라인 및 예외 처리 UI 추가 (`admin.css` 클래스 분리).
    - 프론트엔드: 커스텀 글로벌 유틸(`ghc_whGlobal.js`)을 `main.jsx`에 주입하여 `window.debugOption` 객체 및 단축키 기반 디버깅 환경(Global Hotkey) 구축 완료.
    - 프론트엔드: 공통 API 모듈(`api.js`) 내부에 옵셔널 체이닝(`?.`)을 적용한 안전한 전역 디버그 로직(`if (window.debugOption?.dev?.())`) 삽입을 통해 모든 API 응답값을 콘솔에서 즉시 모니터링 가능하도록 개선.
  - 설정: H2 데이터베이스 저장 경로를 기존 소스코드 내부(`./data`)에서 외부 절대 경로(`C:/Premier/data/premierdb`)로 변경하여 프로젝트 삭제 및 재빌드 시에도 데이터가 영구 보존되도록 안정성 확보.
  - 프론트엔드(빌드): `vite.config.js`에 `build.outDir` 속성을 `../resources/static`으로 구성하여 프론트 빌드 결과물이 스프링부트 정적 리소스 경로로 자동 배포되도록 CI/CD 빌드 파이프라인 단축.
  - 프론트엔드(퍼블릭): 입점사 리스트가 DB에 하나도 없을 경우 더미 데이터를 보여주는 대신, 중앙 화면에 "입점사 대기중 입니다." 문구를 띄우도록 Empty State 처리 고도화 (`PublicPage.jsx`, `Content.jsx`).
  - 프론트엔드(퍼블릭): 뉴스 티커 흐름 속도 최적화 (100s -> 300s)로 가독성 개선 및 통신 장애 시 티커 숨김 처리로 UI 안정성 강화 (`public.css`, `PublicPage.jsx`).
  - 프론트엔드(퍼블릭): Swiper 내 `setTimeout` 클린업 로직 추가로 키오스크 장기 가동 시 메모리 누수 완벽 방지 (`Content.jsx`).
  - 프론트엔드(퍼블릭): 주차장 상세 정보 CSS 좌측 정렬 픽스 및 날씨 아이콘 노출 로직 롤백 등 세부 UI 최적화 (`public.css`, `Header.jsx`).
  - **[기능 개선 (News Ticker)]**
    - 백엔드: 뉴스 크롤링 정책(Robots.txt) 및 유료 API 제약에서 벗어나기 위해 **구글 뉴스 RSS** 파싱을 통한 합법적이고 영구적인 실시간 뉴스 수집 아키텍처(`NewsController.java`) 신규 구축.
    - 프론트엔드: 관리자 페이지의 텍스트 티커 설정에 종합, 경제, IT/과학, 스포츠, 부동산(검색) 등 다양한 구글 뉴스 전용 카테고리를 제공하도록 선택지 대폭 확장 (`CommonSettings.jsx`). 초기 기본값을 '경제'에서 '종합'으로 변경.
    - 프론트엔드: 외부 API 의존성을 제거하고 백엔드의 `/api/news`와 직접 연동하도록 개선 (`PublicPage.jsx`).
  - **[기능 개선 (Store Management)]**
    - 프론트엔드(어드민): 입점사 리스트 화면(`StoreManagement.jsx`)에서 다중 체크박스(전체 선택/개별 선택) 기능 및 '선택 삭제' 기능을 백엔드 DELETE API와 연동하여 관리자 편의성 대폭 강화.
  - **[보안 아키텍처 강화 (Security)]**
    - 백엔드: 비인가 사용자의 악의적인 API 호출(데이터 삭제/변조)을 원천 차단하기 위해 `AdminAuthInterceptor` 전역 인터셉터 신규 도입.
    - 백엔드: 모든 `POST`, `PUT`, `DELETE` 요청 전 관리자 세션 검증 로직 강제화 (조회용 `GET` 및 `OPTIONS`는 퍼블릭 통과).
    - 백엔드: DB 유출 사고 대비를 위해 `PasswordUtil`을 신규 생성하여, 관리자 패스워드를 단순 평문이 아닌 **HMAC-SHA256** 단방향 알고리즘 및 고유 Salt 키(`SECRET_KEY`)를 통해 암호화 저장하도록 조치.
    - 백엔드: 긴급 관리자 계정 추가를 위한 개발자 전용 API 백도어(`POST /api/admin/create`) 구축. (해당 API는 인터셉터를 우회하도록 예외 처리되었으나, 프론트엔드 UI에는 노출되지 않음).
  - 프론트엔드(설정): 커스텀 로딩/애니메이션 UI 구성을 위해 `lottie-web` 라이브러리(`npm install lottie-web`) 신규 설치 및 유틸 연동 설정.
  - 프론트엔드(관리자): 입점사 관리 상세 폼(`StoreDetailForm.jsx`) 저장 전 필수 값 검증(Value Check) 로직 추가 및 미입력 항목 Alert 안내 기능 구현.
  - 프론트엔드(관리자): 입점사 상세 폼 전화번호 입력란(`phone1, 2, 3`)에 대해 `maxLength` 4글자 제한 및 정규식(`/[^0-9]/g`) 기반 숫자 전용 입력 강제 처리 도입.
  - 프론트엔드(퍼블릭): 개별 입점사의 상세 정보(`StoreDetail.jsx`)를 확인할 수 있는 상세보기 화면 전환 컴포넌트 구현 및 디자인 적용.
  - 프론트엔드(퍼블릭): 메인 카드 슬라이더(`Content.jsx`) 및 상세 메인 배너(`StoreDetail.jsx`)에서 이미지 파일이 존재하지 않거나 서버에서 `"null"` 값을 반환할 때, 엑스박스(깨진 아이콘)가 나오지 않도록 방어 로직 추가 및 기본 플레이스홀더 배경을 완전한 검정색(`#000000`)으로 변경.
  - 프론트엔드(퍼블릭): 상세 정보 화면 하단의 '이벤트 배너' 역시 이미지가 누락된 경우 완벽히 화면에서 숨기도록 조건부 렌더링 강도 강화.
  - 프론트엔드(퍼블릭): 하단 영업 안내 배너(`BottomBanner.jsx`) 레이아웃을 가로형으로 개편하고, 이중 서클 형태의 고급형 커스텀 아이콘을 CSS로 구현하여 시안과 동일한 퀄리티로 고도화.
  - 프론트엔드(퍼블릭): 입점사 상세 뷰(`StoreDetail.jsx`)의 주차 안내 및 카테고리/층수 레이아웃을 인라인 스타일에서 외부 CSS(`public.css`)로 완벽히 분리 및 모듈화.
  - 프론트엔드(퍼블릭): 입점사 리스트 슬라이더(`Content.jsx`)에 비동기 데이터 로딩 직후 Swiper `Autoplay` 및 `Loop`가 정지되는 프레임워크 고질적 버그를 해결하기 위해 React Key 갱신 리마운팅(`key`) 전략 적용 및 옵저버(`observer`) 속성 부여.
  - 프론트엔드(퍼블릭): 퍼블릭 UI 스타일 시트(`public.css`) 내 온도 표시 및 컴포넌트 클래스 관련 오타 수정 및 스타일 안정화 진행.
  - 백엔드: 각 입점사별로 주차 안내를 개별 설정할 수 있도록 `StoreInfo.java`에 `parkingTitle`, `parkingDetail` 필드 추가 및 `StoreInfoService` 업데이트 완료.
  - 백엔드: 효용성이 떨어진 기존 `CommonInfo`의 공통 주차 설정 기능을 백엔드(Entity, DTO, Service) 및 프론트엔드(`CommonSettings.jsx`)에서 완전히 제거하여 스키마 최적화.
  - 설정: 프론트엔드 로컬 환경에서 업로드 이미지(`C:/Premier/img`) 표출을 위한 Vite 프록시(`/img`) 설정 추가.
- **[2026-05-11]**
  - 프론트엔드: 존재하지 않는 경로 접근 시 안내 메시지와 메인 이동 버튼을 제공하는 커스텀 `404 NotFound` 페이지 라우팅 적용.
  - 프론트엔드(관리자): 입점사 리스트(`StoreManagement.jsx`)에서 백엔드 `GET /api/stores` 연동 및 동적 렌더링(수정일, 층수 등) 적용 완료.
  - 프론트엔드(관리자): 입점사 상세 폼(`StoreDetailForm.jsx`) 연동 - 숨김 파일 입력기(input type=file)를 활용한 커스텀 이미지 파일찾기 버튼 구현 및 `FormData` 객체 기반의 멀티파트 서버 전송(POST/PUT) 로직 완성.
  - 프론트엔드(관리자): 리스트에서 [상세보기] 클릭 시 `GET /api/stores/{id}`를 호출하여 데이터 바인딩 후, 저장 시 자동 업데이트(PUT)되도록 분기 처리 완료.
  - 백엔드: 입점사(Store) 신규 등록을 위한 `StoreInfo` Entity, Repository, Service, API Controller 구축.
  - 백엔드: 로컬 스토리지(`C:/Premier/img/`) 기반 멀티파트(Multipart) 이미지 업로드 로직 및 정적 리소스 URL 매핑(`WebConfig`) 완료.
  - 백엔드: 대용량 이미지 업로드를 지원하기 위해 `application.yml`의 multipart `max-file-size` 50MB로 상향 조정.
  - 프론트엔드(관리자): 입점사 리스트 하드코딩 더미 데이터 삭제 및 빈 배열 상태 예외 처리(UI 메시지) 추가.
  - 프론트엔드(관리자): 공통정보 관리 폼의 주차 안내, 건물 안내 텍스트 영역 `maxLength` 1000자로 상향.
  - 프론트엔드(관리자): `AdminDashboard`를 기능별(공통 설정, 입점사 관리, 입점사 상세 폼) 컴포넌트로 완벽 분리 및 모듈화 (`CommonSettings`, `StoreManagement`, `StoreDetailForm`).
  - 프론트엔드(관리자): 입점사 통합 관리 상세 폼 레이아웃 및 스타일(admin.css) 신규 테마(골드/브라운)에 맞게 구현 및 로그인 UI 톤앤매너 개선.
  - 백엔드: 공통 정보 관리 저장을 위한 `CommonInfo` Entity, Repository, Service, API Controller 구축 (JPA `ddl-auto` 연동).
  - 프론트엔드(퍼블릭): 공통 정보(주소, 뉴스 티커 종류, 주차 요금/상세, 건물 운영 안내) API 연동 완료 및 `Header`, `BottomBanner`, `NewsBanner` 동적 렌더링 반영.
  - 프론트엔드: `Swiper` 라이브러리를 활용한 메인 콘텐츠 3D 카드 슬라이드 레이아웃(Coverflow) 구축.
  - 프론트엔드: 자동 무한 루프(`loop`) 및 오토플레이(3초) 적용, 사용자 인터랙션 후 5초 대기 시 자동 재생 재개 로직 구현.
  - 프론트엔드: Swiper Coverflow 초기 렌더링 시 너비 계산 오류로 인한 좌측 쏠림 버그 해결 (배열 복제 및 강제 업데이트 로직 추가).
  - 프론트엔드: `NewsAPI.org` 연동하여 미국 경제/비즈니스(`country=us&category=business`) 최신 헤드라인 무한 스크롤(Marquee, 60초) 속보 배너 적용.
  - 프론트엔드: `dayjs` 라이브러리를 사용해 상단 헤더 실시간 시계 구현 (1초 단위 갱신).
  - 백엔드: 전역 공통 응답 처리용 `ApiResponse` DTO 적용 완료 및 `RES_SUCCESS=0` 코드 정의.

## 2. 개발 환경 정보
- **Language**: Java 17, JavaScript (React)
- **Framework/Library**:
  - Backend: Spring Boot 4.0.6 (Spring Web, Spring Data JPA)
  - Frontend: React 18, Vite, Swiper, dayjs
- **Database**: H2 Database (In-memory)
- **Build Tool**: Gradle (Groovy), npm
- **Version Control**: Git

## 3. 주요 기능 및 요구사항
- **실시간 속보 배너**: 외부 뉴스 API 데이터를 연동하여 화면을 가로지르는 Marquee 애니메이션 배너 제공.
- **실시간 시간 표출**: 한국 기준 로컬 타임(AM/PM 포함) 1초 단위 업데이트 표출.
- **시설/층별 안내 슬라이드**: `Swiper`의 3D Coverflow 이펙트를 이용해 지점 내 여러 라운지와 식당의 운영 시간 및 연락처 표시. 터치 및 드래그 동작 지원.
- **관리자 기능**: 사용자/관리자 API 통신 및 H2 DB 세션 기반의 백엔드 연동 지원.

## 4. 빌드 및 실행 관련 가이드라인
**[Frontend]**
```bash
cd src/main/front
npm install
npm run dev
```

**[Backend]**
```bash
./gradlew bootRun
```

## 5. 작업 담당자 정보
- **이름**: 전윤기
- **역할**: Full-stack Development
- **이메일**: ture403@gmail.com

## 6. Git Branch별 상세 설명
- `main`: 운영/배포에 직접 반영되는 안정적인 최종 코드 (Protected)
- `develop`: 기능 개발 및 테스트 통합이 이루어지는 메인 개발 브랜치

## 7. 기타 및 특이사항
- NewsAPI 호출 시 무료 개발자 키 제약으로 인해 로컬(Localhost) 환경에서 원활한 테스트가 가능하며, 실 서비스 전환 시 CORS 설정과 함께 백엔드 프록시 또는 유료 API 키 전환 고려 필요.
- GitLab의 `main` 브랜치는 Protected 설정되어 있어 직접 Push가 불가능하므로, 작업 후 `develop` 브랜치에 Push한 뒤 Merge Request로 진행해야 함.
- **[데이터 영구 보존 구조]**: 시스템의 모든 DB 데이터(`premierdb.mv.db`)와 업로드 이미지 파일들은 소스 코드 폴더와 완전히 분리되어 **`C:/Premier/data`** 및 **`C:/Premier/img`** 폴더에 각각 물리적으로 안전하게 저장됨. 
  - 추후 키오스크 PC 변경 또는 서버 재설치 시, 해당 `C:/Premier` 폴더만 그대로 복사하여 이관하면 백업 및 복구가 100% 완료되는 폐쇄형(Local) 독립 구조임.
- **[관리자 초기 계정]**: 최초 구동 시 (DB 초기화 상태) 자동으로 생성되는 기본 관리자 계정 정보입니다.
  - **ID**: `admin`
  - **Password**: `admin1234`
