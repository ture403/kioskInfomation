import React from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>404</h1>
      <h2 style={styles.subtitle}>페이지를 찾을 수 없습니다.</h2>
      <p style={styles.description}>요청하신 페이지가 사라졌거나 잘못된 경로를 입력하셨습니다.</p>
      <button style={styles.button} onClick={() => navigate("/")}>
        메인으로 가기
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#F4F4F4",
    fontFamily: "'Noto Sans KR', sans-serif",
  },
  title: {
    fontSize: "80px",
    color: "#6C5D53",
    margin: "0 0 15px 0",
    fontWeight: "bold",
    lineHeight: "1",
  },
  subtitle: {
    fontSize: "24px",
    color: "#333",
    marginTop: "10px",
    marginBottom: "20px",
  },
  description: {
    fontSize: "16px",
    color: "#666",
    marginBottom: "40px",
  },
  button: {
    padding: "15px 40px",
    backgroundColor: "#F8C25B",
    color: "#333",
    border: "none",
    borderRadius: "6px",
    fontSize: "16px",
    fontWeight: "bold",
    cursor: "pointer",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  },
};

export default NotFound;
