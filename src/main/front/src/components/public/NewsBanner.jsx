function NewsBanner({ newsText }) {
  // 1. 글자가 너무 짧을 경우 (직접입력 모드 등), 화면을 꽉 채우기 위해 텍스트 자체를 여러 번 반복시킵니다.
  let displayText = newsText;
  if (displayText && displayText.length < 200) {
    const repeatNeeded = Math.ceil(200 / displayText.length);
    displayText = Array(repeatNeeded).fill(displayText.trim()).join(" ㆍ ");
  }

  // 2. 텍스트 길이에 비례하여 항상 일정한 스크롤 속도를 보장하도록 duration을 동적으로 계산합니다.
  // (이동 거리는 전체 컨테이너의 50%이므로, 3개의 span 길이에 해당함. 글자당 0.2초 상수 부여)
  const distanceChars = 3 * (displayText ? displayText.length : 0);
  const duration = distanceChars * 0.2 + "s";

  return (
    <div className="news-banner">
      <div className="news-content" style={{ "--banner-duration": duration }}>
        <span className="news-item">{displayText}</span>
        <span className="news-item">{displayText}</span>
        <span className="news-item">{displayText}</span>
        <span className="news-item">{displayText}</span>
        <span className="news-item">{displayText}</span>
        <span className="news-item">{displayText}</span>
      </div>
    </div>
  );
}

export default NewsBanner;
